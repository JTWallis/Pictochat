import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import './Canvas.css'

// BIG TODO:
//  Store all Canvas draw-commands in a queue.
//  Separate by: Line-strokes, writing text and FloatingKeys.
//  Values that get stored: ID(e.g. A-38, whereas 'A' stands for the chatroom), Type(see above), start+end-positions, keyValue/srcPath, creator-name.
//  Preserve the order of the draw-commands!
//  Finally, do a single POST to the backend with all the data.
//   Other frontends receive the message (via hook or polling) and reconstruct that image.
//   Creator that accidentally also receives this message can ignore it when comparing the creator-names.
//   CAUTION: Different resolutions may look weird because of pixel-values.
//       FIX: Convert all the absolute pixel-values into normalized coordinates between 0.0 and 1.0.
//  Users can "pull" the latest image on their end. This makes a GET request with the image-id.
//    Can also act as a safety-net if a message that was supposed to be received got lost.
//  Fluff: 
//   On drawing/erasing an image, do some funny effects by constructing the commands slowly line by line.
//   Embed creator-name(+container) into canvas? When opening image in new tab this will then show too. Otherwise that part might be blank (can still draw there tho).
//     Maybe add option to enable/disable this. 

// Follow-up:
//  Images that are displayed on the upper screen can be a smaller height.
//  Minimum height is until the first stripe (including the name).
//  Maximum height is the total canvas height.
//  Normalization ofc has to happen here as well!

const stripeColor = "green";

const stripeStyle: React.CSSProperties = {
    color: stripeColor
};

const stripeCount = 4;

const stripes: any = [];
for (let i = 0; i < stripeCount; i++) {
    stripes.push(
        <hr key={"Stripe-" + i} className="stripe" style={stripeStyle} />
    )
}

const colorBackground = "#AAA";
const colorForeground = "#000";
const sizeSmall = 1.0;
const sizeLarge = 3.0;
//let mouseDown: boolean = false;
//let prevX: number | null = null;
//let prevY: number | null = null;
let colorPen = colorForeground;
let sizePen = sizeSmall;
let isRainbow = false;

// TODO: Make relative instead of px.
const canvasTextPosXOffset = 5;

// TODO: Implement backspace on canvas
//  Idea: Redraw canvas (with all lines and chars) and fill text anew.


// TODO: Callback to keyboard, make button press visible 
function Canvas(props: any) {

    const [mouseDown, setMouseDown] = useState(false);
    const [posX, setPosX] = useState(-1);
    const [posY, setPosY] = useState(-1);
    const [prevPosX, setPrevPosX] = useState(-1);
    const [prevPosY, setPrevPosY] = useState(-1);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const nameContainerRef = useRef<HTMLDivElement>(null);

    const [canvasWidth, setCanvasWidth] = useState(300);
    const [canvasHeight, setCanvasHeight] = useState(150);

    const [canvasTextPosX, setCanvasTextPosX] = useState(0);
    const [canvasTextPosY, setCanvasTextPosY] = useState(0);

    const [outerText, setOuterText] = useState("");
    const [outerPos, setOuterPos] = useState({
       x: 0,
       y: 0
    });

    useImperativeHandle(props.canvasRef, () => ({
        drawText(text: string, screenX: number, screenY: number) {
            setOuterPos({
                x: screenX,
                y: screenY
            })
            setOuterText(text);
        }
    }));

    useEffect(() => {
        const w = canvasContainerRef.current?.clientWidth!;
        const h = canvasContainerRef.current?.clientHeight!;
        
        addEventListener("resize", () => setCanvasSize(w, h));

        return () => {
            removeEventListener("resize", () => setCanvasSize(w, h));
        }
    }, []);

    useEffect(() => {
        const w = canvasContainerRef.current?.clientWidth!;
        const h = canvasContainerRef.current?.clientHeight!;
        setCanvasSize(w, h);
    }, [canvasContainerRef.current?.clientWidth, canvasContainerRef.current?.clientHeight]);

    useEffect(() => {
        const canvasContext = canvasRef?.current?.getContext("2d");
        const offsetTop = canvasRef.current?.offsetTop;
        const offsetLeft = canvasRef.current?.offsetLeft;

        if(canvasContext) {
            draw(canvasContext, offsetTop!, offsetLeft!);
        }

    }, [posX, posY]);

    useEffect(() => {
        handleCanvasTextChange();
    }, [props.canvasText]);

    useEffect(() => {
        const canvasContext = canvasRef?.current?.getContext("2d");
        const maxWidth : number = canvasRef.current?.width!;

        // TODO: If position is outside of canvas, do nothing.

        // Drawn FloatingKey value onto canvas is slightly offset from the dragged one,
        //  resulting in a "pop effect". This offset makes the position accurate again.
        const offsetPopFixY = -13;
        const offsetTop = canvasRef.current?.offsetTop! + offsetPopFixY;
        const offsetLeft = canvasRef.current?.offsetLeft!;
        canvasContext!.font = "16px Courier New";
        canvasContext!.fillText(outerText, outerPos.x - offsetLeft, outerPos.y - offsetTop, maxWidth);
    }, [outerText, outerPos]);

    function handleCanvasTextChange() {
        const canvasContext = canvasRef?.current?.getContext("2d");

        const maxWidth : number = canvasRef.current?.width!;

        canvasContext!.font = "16px Courier New";
        canvasContext!.fillText(props.canvasText.charAt(props.canvasText.length-1), canvasTextPosX, canvasTextPosY, maxWidth);
        setCanvasTextPosX(prev => prev + 8);
        if(canvasTextPosX >= (maxWidth - canvasTextPosXOffset)) {
            setCanvasTextPosX(canvasTextPosXOffset);
            setCanvasTextPosY(prev => prev + canvasRef?.current?.height! / (stripeCount+1));
        }
    }

    function setCanvasSize(width: number, height: number) {
        console.log("CanvasSize");
        setCanvasWidth(width);
        setCanvasHeight(height);

        const h = height / (stripeCount + 1);
        const w = nameContainerRef.current?.clientWidth!;
        setCanvasTextPosX(w + canvasTextPosXOffset);
        setCanvasTextPosY(h - h/2);
    }

    function resetPos() {
        setPosX(-1);
        setPosY(-1);
        setPrevPosX(-1);
        setPrevPosY(-1);
    }

    function canvas_mousedown(event: any) {
        setMouseDown(true);
        setPosX(event.pageX);
        setPosY(event.pageY);
    }

    function canvas_mousemove(event: any) {
        if (!mouseDown) return;
        setPosX(event.pageX);
        setPosY(event.pageY);
    }

    function canvas_mouseup(event: any) {
        setMouseDown(false);
        resetPos();
    }

    function canvas_mouseenter(event: any) {
        if (!mouseDown) return;

        setPosX(event.pageX);
        setPosY(event.pageY);
    }

    function canvas_mouseleave(event: any) {
        if (!mouseDown) return;

        //draw(event);

        //prevX = null;
        //prevY = null;
    }

    function draw(context: CanvasRenderingContext2D, offsetTop: number, offsetLeft: number) {


        if (prevPosX >= 0) {

            context.beginPath();
            context.moveTo(prevPosX - offsetLeft, prevPosY - offsetTop);
            context.lineTo(posX - offsetLeft, posY - offsetTop);
            context.lineWidth = sizePen;
            context.strokeStyle = colorPen;
            context.lineCap = "square";
            context.stroke();

        } else {
            context.fillStyle = colorPen;
            context.fillRect(posX - offsetLeft, posY - offsetTop, sizePen, sizePen);
        }

        setPrevPosX(posX);
        setPrevPosY(posY);
    }

    return (
        <div className="screen" ref={canvasContainerRef}>
            <div className="canvasBackground"> 

            </div>
            <label className="text">{/*props.canvasText*/}</label>
            <div className="stripes">
                {stripes}
            </div>
            <canvas
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={canvas_mousedown}
                onMouseUp={canvas_mouseup}
                onMouseMove={canvas_mousemove}
                onMouseEnter={canvas_mouseenter}
                onMouseLeave={canvas_mouseleave}
                ref={canvasRef}>
            </canvas>
            <div className="borderContainer">
                <div className="nameContainer" ref={nameContainerRef}>
                    <label>Sample Name</label>
                </div>
            </div>
        </div>
    );
}

export default Canvas;
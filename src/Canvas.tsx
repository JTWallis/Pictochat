import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import './Canvas.css'

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
let colorPen = colorForeground;
let sizePen = sizeSmall;
let isRainbow = false;

const canvasTextPosXOffset = 5;

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
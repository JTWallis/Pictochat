import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import './Canvas.css'
import { Message } from './Message';
import { Vector2 } from './Vector2';
import { DrawCommand, DrawingCommandType } from './DrawCommand';

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

    const [canvasTextPosX, setCanvasTextPosX] = useState(-1);
    const [canvasTextPosY, setCanvasTextPosY] = useState(-1);

    const [floatingKeyValue, setFloatingKeyValue] = useState("");
    const [floatingKeyPos, setFloatingKeyPos] = useState({
        x: 0,
        y: 0
    });

    const [message, setMessage] = useState(new Message([]));


    useImperativeHandle(props.canvasRef, () => ({
        drawText(text: string, screenX: number, screenY: number) {
            setFloatingKeyPos({
                x: screenX,
                y: screenY
            })
            setFloatingKeyValue(text);
        },

        sendMessage() {
            sendCurrentMessage();
        }
    }));

    useEffect(() => {
        addEventListener("resize", setCanvasSize);

        return () => {
            removeEventListener("resize", setCanvasSize);
        }
    }, []);

    useEffect(() => {
        setCanvasSize();
    }, [canvasContainerRef.current?.clientWidth, canvasContainerRef.current?.clientHeight]);

    useEffect(() => {
        handleStrokePosChange();
    }, [posX, posY]);

    useEffect(() => {
        handleCanvasTextChange();
    }, [props.canvasText]);

    useEffect(() => {
        handleFloatingKeyAttachment();
    }, [floatingKeyValue, floatingKeyPos]);

    function getCanvasWidth(): number {
        return canvasRef.current?.width!;
    }

    function getCanvasContext(): CanvasRenderingContext2D | null | undefined {
        return canvasRef?.current?.getContext("2d");
    }

    async function sendCurrentMessage() {
        props.addMessage(message);
        await postMessage(message);
        clearCanvas();
        setMessage(new Message([]));
    }

    /**
     * Draws a stroke onto the Canvas based on the previous and current cursor position.
     */
    function handleStrokePosChange() {
        const offsetTop = canvasRef.current?.offsetTop!;
        const offsetLeft = canvasRef.current?.offsetLeft!;

        const drawDot = prevPosX < 0;

        const posPrev: Vector2 = new Vector2(prevPosX - offsetLeft, prevPosY - offsetTop);
        const pos: Vector2 = new Vector2(posX - offsetLeft, posY - offsetTop);
        const posFirst: Vector2 = drawDot ? pos : posPrev;

        drawStroke(posFirst, pos, drawDot);
    }

    /**
     * Draws the dragged Floating Key onto the Canvas.
     */
    function handleFloatingKeyAttachment() {
        // Drawn FloatingKey value onto canvas is slightly offset from the dragged one,
        //  resulting in a "pop effect". This offset makes the position accurate again.
        const offsetPopFixY = -13;
        const offsetTop = canvasRef.current?.offsetTop! + offsetPopFixY;
        const offsetLeft = canvasRef.current?.offsetLeft!;

        const pos: Vector2 = new Vector2(floatingKeyPos.x - offsetLeft, floatingKeyPos.y - offsetTop);
        const value: string = floatingKeyValue;

        drawText(DrawingCommandType.FLOATING_KEY, pos, value);
    }

    /**
     * Draws a char onto the Canvas upon pressing a Button on the Virtual Keyboard 
     *  or typing a key on the physical keyboard.
     */
    function handleCanvasTextChange() {
        const pos: Vector2 = new Vector2(canvasTextPosX, canvasTextPosY);
        const value: string = props.canvasText.charAt(props.canvasText.length - 1);

        drawText(DrawingCommandType.TEXT, pos, value);

        const maxWidth = getCanvasWidth();

        setCanvasTextPosX(prev => prev + 8);
        if (canvasTextPosX >= (maxWidth - canvasTextPosXOffset)) {
            setCanvasTextPosX(canvasTextPosXOffset);
            setCanvasTextPosY(prev => prev + canvasRef?.current?.height! / (stripeCount + 1));
        }
    }

    function setCanvasSize() {
        console.log("CanvasSize");
        const width = canvasContainerRef.current?.clientWidth!;
        const height = canvasContainerRef.current?.clientHeight!;

        setCanvasWidth(width);
        setCanvasHeight(height);

        const h = height / (stripeCount + 1);
        const w = nameContainerRef.current?.clientWidth!;
        setCanvasTextPosX(w + canvasTextPosXOffset);
        setCanvasTextPosY(h - h / 2);
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
        sendCurrentMessage();

        console.log("DrawCommands:");
        const commands = message.getCommands();
        for (let i = 0; i < commands.length; i++) {
            console.log("  ", commands[i].debugPrintString());
        }
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

    function normalizeCanvasPos(canvasPos: Vector2): Vector2 {
        const width = getCanvasWidth();
        const height = canvasRef.current?.height!;

        return new Vector2(canvasPos.x / width, canvasPos.y / height);
    }

    function clearCanvas() {
        const context = getCanvasContext();
        const height = canvasRef.current?.height!;
        context?.clearRect(0, 0, getCanvasWidth(), height);
    }

    function drawText(drawingCommandType: number, pos: Vector2, value: string) {
        const context = getCanvasContext();
        if (!context) return;

        const maxWidth = getCanvasWidth();

        context.font = "16px Courier New";
        context.fillText(value, pos.x, pos.y, maxWidth);

        const normalizedPos = normalizeCanvasPos(pos);

        message.pushCommand(drawingCommandType, normalizedPos, normalizedPos, value, sizePen, colorPen);
    }

    function drawStroke(posSrc: Vector2, posDst: Vector2, drawDot: boolean) {
        const context = getCanvasContext();
        if (!context) return;

        if (drawDot) {
            context.fillStyle = colorPen;
            context.fillRect(posSrc.x, posSrc.y, sizePen, sizePen);
        } else {
            context.beginPath();
            context.moveTo(posSrc.x, posSrc.y);
            context.lineTo(posDst.x, posDst.y);
            context.lineWidth = sizePen;
            context.strokeStyle = colorPen;
            context.lineCap = "square";
            context.stroke();
        }

        message.pushCommand(DrawingCommandType.LINE_STROKE, normalizeCanvasPos(posSrc), normalizeCanvasPos(posDst), "", sizePen, colorPen);

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
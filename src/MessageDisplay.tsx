import { useEffect, useRef, useState } from 'react';
import './MessageDisplay.css';
import { Vector2 } from './Vector2';
import type { Message } from './Message';
import { DrawingCommandType } from './DrawCommand';

function MessageDisplay( {message}: any ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const nameContainerRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(300);
    const [canvasHeight, setCanvasHeight] = useState(150);

    useEffect(() => {
        addEventListener("resize", setCanvasSize);

        return () => {
            removeEventListener("resize", setCanvasSize);
        }
    }, []);

    useEffect(() => {
        setCanvasSize();
    }, [canvasContainerRef.current?.clientWidth, canvasContainerRef.current?.clientHeight]);

    function setCanvasSize() {
        const width = canvasContainerRef.current?.clientWidth!;
        const height = canvasContainerRef.current?.clientHeight!;
        setCanvasWidth(width);
        setCanvasHeight(height);

        reconstructMessage();
    }

    function getCanvasWidth(): number {
        return canvasRef.current?.width!;
    }

    function getCanvasContext(): CanvasRenderingContext2D | null | undefined {
        return canvasRef?.current?.getContext("2d");
    }

    function unNormalizePos(pos: Vector2): Vector2 {
        const height = canvasRef.current?.height!;
        return new Vector2(pos.x * getCanvasWidth(), pos.y * height);
    }

    function reconstructMessage() {
        if(!message) return;

        const drawingCommands = (message as Message).getCommands();
        for(let i = 0; i < drawingCommands.length; i++) {
            const command = drawingCommands[i];
            const posStart = unNormalizePos(command.getStartPos());

            if(command.getType() === DrawingCommandType.LINE_STROKE) {
                const posEnd = unNormalizePos(command.getEndPos());
                const drawDot = posStart.equals(posEnd);
                drawStroke(posStart, posEnd, drawDot, command.getPenSize(), command.getPenColor());
            } else {
                drawText(command.getType(), posStart, command.getValue());
            }
        }
    }

    function drawText(drawingCommandType: number, pos: Vector2, value: string) {
        const context = getCanvasContext();
        if (!context) return;

        const maxWidth = getCanvasWidth();

        context.font = "16px Courier New";
        context.fillText(value, pos.x, pos.y, maxWidth);
    }

    function drawStroke(posSrc: Vector2, posDst: Vector2, drawDot: boolean, sizePen: number, colorPen: string) {
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
    }

    return (
        <div className="displayScreen" ref={canvasContainerRef}>
            <div className="canvasBackground">

            </div>
            <canvas
                width={canvasWidth}
                height={canvasHeight}
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


export default MessageDisplay
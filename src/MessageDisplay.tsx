import { useEffect, useRef, useState } from 'react';
import './MessageDisplay.css';
import { Vector2 } from './Vector2';
import type { Message } from './Message';
import { DrawingCommandType } from './DrawCommand';

const stripeStyle: React.CSSProperties = {
    color: "red"
};

const stripeCount = 4;

const stripes: any = [];
for (let i = 0; i < stripeCount; i++) {
    stripes.push(
        <hr key={"Stripe-" + i} className="stripe" style={stripeStyle} />
    )
}

function MessageDisplay( {message}: any ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const stripesContainerRef = useRef<HTMLDivElement>(null);
    const nameContainerRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(300);
    const [canvasHeight, setCanvasHeight] = useState(150);
    const [drawnHeight, setDrawnHeight] = useState(150);
    const [drawnLowest, setDrawnLowest] = useState(0.0);
    const [drawnStripeOffset, setDrawnStripeOffset] = useState(0);

    useEffect(() => {
        addEventListener("resize", setCanvasSize);
        initDrawnHeight();

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

    function initDrawnHeight() {
        if(!message) return;
        let lowest = 1.0;
        let highest = 0.0;
        const drawingCommands = (message as Message).getCommands();

        // Find normalized, lowest and highest drawn position. 
        for(let i = 0; i < drawingCommands.length; i++) {
            const command = drawingCommands[i];
            const startY = command.getStartPos().y;
            const endY = command.getEndPos().y;
            if(startY >= 0.0) lowest = Math.min(lowest, command.getStartPos().y);
            if(endY >= 0.0) lowest = Math.min(lowest, command.getEndPos().y);
            if(startY <= 1.0) highest = Math.max(highest, command.getStartPos().y);
            if(endY <= 1.0) highest = Math.max(highest, command.getEndPos().y);
        }

        // Find normalized stripe positions.
        const stripeContainerChildren = stripesContainerRef.current!.children;
        const canvasRect = canvasContainerRef.current!.getBoundingClientRect();
        const canvasTop = canvasRect.top;
        const canvasHeight = canvasRect.height;
        let positions: number[] = [];
        for(let i = 0; i < stripeContainerChildren.length; i++) {
            const stripe = stripeContainerChildren[i];
            const rect = stripe.getBoundingClientRect();
            positions.push((rect.bottom - canvasTop) / canvasHeight);
        }

        // Find lowest stripe pos that the lowest drawing pos exceeds
        //   and highest stripe pos that the highest drawing pos subceeds.
        positions = [0.0, ...positions, 1.0];
        let lowestStripePos = 0;
        let highestStripePos = 1.0;

        for(let i = 0; i < positions.length; i++) {
            if(lowest >= positions[i]) {
                lowestStripePos = positions[i];
            } else {
                break;
            }
        }

        for(let i = positions.length - 1; i >= 0; i--) {
            if(highest <= positions[i]) {
                highestStripePos = positions[i];
            } else {
                break;
            }
        }

        setDrawnLowest(lowest);
        setDrawnHeight(highestStripePos - lowestStripePos);
        setDrawnStripeOffset(lowest - lowestStripePos);
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
            const offsetStart = new Vector2(command.getStartPos().x, command.getStartPos().y - drawnLowest + drawnStripeOffset);
            const posStart = unNormalizePos(offsetStart);
            

            if(command.getType() === DrawingCommandType.LINE_STROKE) {
                const offsetEnd = new Vector2(command.getEndPos().x, command.getEndPos().y - drawnLowest + drawnStripeOffset);
                const posEnd = unNormalizePos(offsetEnd);
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
            <div className="stripes" ref={stripesContainerRef}>
                {stripes}
            </div>
            <canvas
                width={canvasWidth}
                height={canvasHeight}
                ref={canvasRef}>
            </canvas>
            <div className="borderContainer">
                <div className="nameContainer" ref={nameContainerRef}>
                    <label>{message.getUsername()}</label>
                </div>
            </div>
        </div>
    );
}


export default MessageDisplay
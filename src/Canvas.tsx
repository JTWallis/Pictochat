import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import './Canvas.css'
import { Vector2 } from './Vector2';
import { DrawingCommandType } from './DrawCommand';

const stripeCount = 4;

function Canvas({ canvasComponentRef, message, userColor, onCanvasResize, findCharRepFromValue, drawOffsetY, showStripes, stripesContainerRef, showName, nameContainerRef}: any) {


    useImperativeHandle(canvasComponentRef, () => ({
        drawText(pos: Vector2, text: string) {
            drawText(pos, text);
        },

        drawStroke(posStart: Vector2, posEnd: Vector2, size: number, color: string) {
            const drawDot = posStart.equals(posEnd);
            drawStroke(posStart, posEnd, drawDot, size, color);
        },

        drawImage(img: HTMLImageElement, pos: Vector2, colorFill: string) {
            drawImage(img, pos, colorFill);
        },

        clearCanvas() {
            clearCanvas();
        },

        reconstructMessage() {
            reconstructMessage();
        }
    }));

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    const [canvasSize, setCanvasSize] = useState(new Vector2(300, 150));
    const [originalCanvasHeight, setOriginalCanvasHeight] = useState(150);


    useEffect(() => {
        addEventListener("resize", updateCanvasSize);
        setOriginalCanvasHeight(canvasContainerRef.current!.getBoundingClientRect().height);

        return () => {
            removeEventListener("resize", updateCanvasSize);
        }
    }, []);

    useEffect(() => {
        updateCanvasSize();
    }, [canvasContainerRef.current?.clientWidth, canvasContainerRef.current?.clientHeight]);

    useEffect(() => {
        clearCanvas();
        reconstructMessage();
        if(onCanvasResize) onCanvasResize();
    }, [canvasSize]);

    function updateCanvasSize() {
        const width = canvasContainerRef.current?.clientWidth!;
        const height = canvasContainerRef.current?.clientHeight!;

        setCanvasSize(new Vector2(width, height));
    }

    function getCanvasWidth(): number {
        return canvasRef.current?.width!;
    }

    function getCanvasContext(): CanvasRenderingContext2D | null | undefined {
        return canvasRef?.current?.getContext("2d");
    }

    function unNormalizePos(pos: Vector2): Vector2 {
        return new Vector2(pos.x * getCanvasWidth(), pos.y * originalCanvasHeight);
    }

    function getStripes() {

        const stripeColor = userColor ? userColor : "green";

        const stripeStyle: React.CSSProperties = {
            color: stripeColor
        };

        const stripes: any = [];
        for (let i = 0; i < stripeCount; i++) {
            stripes.push(
                <hr key={"Stripe-" + i} className="stripe" style={stripeStyle} />
            )
        }

        return stripes;
    }

    function reconstructMessage() {
        if (!message) return;

        const drawingCommands = message.getCommands();

        for (let i = 0; i < drawingCommands.length; i++) {
            const command = drawingCommands[i];
            const offsetY = (!drawOffsetY) ? 0 : drawOffsetY;
            const offsetStart = new Vector2(command.getStartPos().x, command.getStartPos().y - offsetY);
            const posStart = unNormalizePos(offsetStart);
            const offsetEnd = new Vector2(command.getEndPos().x, command.getEndPos().y - offsetY);
            const posEnd = unNormalizePos(offsetEnd);

            if (command.getType() === DrawingCommandType.LINE_STROKE) {
                const drawDot = posStart.equals(posEnd);
                drawStroke(posStart, posEnd, drawDot, command.getPenSize(), command.getPenColor());
            } else if (command.getType() === DrawingCommandType.FLOATING_KEY) {
                let src;
                if (command.getValue().length > 1) {
                    // Command Value should already be a src path.
                    src = command.getValue();
                } else {
                    const rep = findCharRepFromValue(command.getValue());
                    if (rep) src = rep.src;
                }
                if (!src) continue;

                const img = document.createElement("img") as HTMLImageElement;
                img.width = Math.abs(posEnd.x - posStart.x);
                img.height = Math.abs(posEnd.y - posStart.y);
                img.src = src;
                drawImage(img, posStart, "#000");
            } else {
                drawText(posStart, command.getValue());
            }
        }
    }

    function clearCanvas() {
        const context = getCanvasContext();
        const height = canvasRef.current?.height!;
        context?.clearRect(0, 0, getCanvasWidth(), height);
    }

    function drawText(pos: Vector2, value: string) {
        const context = getCanvasContext();
        if (!context) return;

        const maxWidth = getCanvasWidth();

        context.font = "16px Courier New";
        context.fillText(value, pos.x, pos.y, maxWidth);
    }

    function drawStroke(posSrc: Vector2, posDst: Vector2, drawDot: boolean, size: number, color: string) {
        const context = getCanvasContext();
        if (!context) return;

        if (drawDot) {
            context.fillStyle = color;
            context.fillRect(posSrc.x, posSrc.y, size, size);
        } else {
            context.beginPath();
            context.moveTo(posSrc.x, posSrc.y);
            context.lineTo(posDst.x, posDst.y);
            context.lineWidth = size;
            context.strokeStyle = color;
            context.lineCap = "square";
            context.stroke();
        }
    }


    function drawImage(img: HTMLImageElement, pos: Vector2, colorFill: string) {
        const context = getCanvasContext();
        if (!context) return;

        const buffer = document.createElement("canvas");
        buffer.width = img.width;
        buffer.height = img.height;

        const bufferContext = buffer.getContext("2d")!;
        bufferContext.imageSmoothingEnabled = false;
        bufferContext.drawImage(img, 0, 0, img.width, img.height);
        bufferContext.fillStyle = colorFill;
        bufferContext.globalCompositeOperation = "source-atop";
        bufferContext.fillRect(0, 0, buffer.width, buffer.height);

        context.drawImage(buffer, pos.x, pos.y, buffer.width, buffer.height);
    }

    return (
        <div className={className} ref={canvasContainerRef}>
            <div className="canvasContainer">
            <div className="canvasBackground">

            </div>
            {showStripes ? (
                <div className="stripes" ref={stripesContainerRef}>
                    {getStripes()}
                </div>
            ) : (
                <></>
            )}
            <canvas
                width={canvasSize.x}
                height={canvasSize.y}
                ref={canvasRef}>
            </canvas>

                {isSketch ?
                    <MessageSketch
                        className="canvasTypeContainer"
                        canvasText={canvasText}
                        reconstructMessage={reconstructMessage}
                        drawStroke={drawStroke}
                        drawText={drawText}
                        drawImage={drawImage}
                        clearCanvas={clearCanvas}
                        pushMessageCommand={pushMessageCommand}
                        sendMessage={sendMessage}
                        concatBottomScrollMessage={concatBottomScrollMessage}
                        removeLastMessageTextCommand={removeLastMessageTextCommand}
                        getLastMessageTextValue={getLastMessageTextValue}
                        canvasSketchRef={canvasSketchRef}
                    />
                    :
                    <MessageDisplay
                        className="canvasTypeContainer"
                        setStripeSteps={setStripeSteps}
                        setRenderStripes={setRenderStripes}
                        setDrawOffsetY={setDrawOffsetY}
                        getStripeRects={getStripeRects}
                        getNameRect={getNameRect}
                        getMessageCommands={getMessageCommands}
                    />
                }

            <div className="borderContainer">
                {showName ? (
                    <div className="nameContainer" ref={nameContainerRef}>
                        <label>{message.getUsername()}</label>
                    </div>
                ) : (
                    <></>
                )}
                </div>
            </div>
        </div>
    );
}

export default Canvas;
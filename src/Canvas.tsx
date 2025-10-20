import React, { useEffect, useRef, useState } from 'react';
import './Canvas.css'
import { Vector2 } from './Vector2';
import { DrawingCommandType } from './DrawCommand';
import CanvasSketch from './CanvasSketch';
import CanvasDisplay from './CanvasDisplay';
import type { CanvasSketchFullAPI, CanvasSketchPartialAPI, CanvasDisplayAPI, CanvasSpecialPartialAPI, CanvasSpecialFullAPI } from './CanvasAPI';
import { CanvasTypes } from './CanvasAPI';
import type { Message } from './Message';
import type { CharRepresentation } from './CharRepresentation';
import CanvasSpecial from './CanvasSpecial';

const stripeCount = 4;
const lineCharSize = 1 / 24;
const canvasSizeAddPx = 8;      // Without this, a FloatingKey placed just above a stripe will be drawn cut off.
const canvasTextPosXOffset = 5;
const canvasDisplayMarginPx = 2;

interface CanvasSketchProperties {
    canvasText: string,
    api: CanvasSketchPartialAPI,
    canvasSketchRef: React.RefObject<any>
    floatingKeyRef: React.RefObject<any>
}

interface CanvasSpecialProperties {
    messageText: string,
    textColor: string,
    api: CanvasSpecialPartialAPI
}

interface CanvasProps {
    defaultHeightPercent: number,
    canvasType: number,
    message: Message,
    findCharRepFromValue: (value: string) => CharRepresentation | undefined,
    hideName?: boolean,
    userColor?: string,
    onCanvasResize?: () => void,
    sketchProperties?: CanvasSketchProperties
    specialProperties?: CanvasSpecialProperties
}

function Canvas(props: CanvasProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const stripesContainerRef = useRef<HTMLDivElement>(null);
    const nameContainerRef = useRef<HTMLDivElement>(null);

    const [containerHeightPercent, setContainerHeightPercent] = useState(props.defaultHeightPercent);
    const [canvasSize, setCanvasSize] = useState(new Vector2(300, 150));
    const [originalCanvasHeight, setOriginalCanvasHeight] = useState(-1);
    const [renderStripes, setRenderStripes] = useState(true);
    const [drawOffsetY, setDrawOffsetY] = useState(0);
    const [ongoingReconstruct, setOngoingReconstruct] = useState<AbortController | null>(null);

    const canvasTextPosRef = useRef(new Vector2(-1, -1));
    const appliedStripeStepsRef = useRef(stripeCount);
    const buttonWidth = getCanvasWidth() * lineCharSize;


    useEffect(() => {
        addEventListener("resize", updateCanvasSize);
        initFloatingKeySize();

        return () => {
            removeEventListener("resize", updateCanvasSize);
        }
    }, []);

    useEffect(() => {
        updateCanvasSize();
    }, [canvasContainerRef.current?.clientWidth, canvasContainerRef.current?.clientHeight]);

    useEffect(() => {
        updateCanvasTextPos();
    }, [props.message]);

    function initFloatingKeySize() {
        if (!props.sketchProperties) return;

        const width = getCanvasWidth();
        const buttonWidth = width * lineCharSize;

        props.sketchProperties.floatingKeyRef.current!.setSize(buttonWidth);
    }

    function setCanvasTextPos(pos: Vector2) {
        canvasTextPosRef.current = pos;
    }

    function updateCanvasTextPos() {
        if (!props.sketchProperties && !props.specialProperties) return;
        const height = canvasContainerRef.current?.clientHeight!;

        if (props.sketchProperties) {
            const lastTextCommand = props.sketchProperties.api.getLastMessageText();
            if (lastTextCommand) {
                const width = canvasContainerRef.current?.clientWidth!;
                const x = lastTextCommand.getStartPos().x * width;
                const y = (lastTextCommand.getStartPos().y + lastTextCommand.getEndPos().y) / 2 * height;
                const pos = new Vector2(x, y);
                incrementCanvasTextPosX(pos);
                return;
            }
        }

        const nameCurrent = nameContainerRef.current;
        const xOffset = nameCurrent ? nameCurrent.clientWidth : 0;
        const yOffset = (appliedStripeStepsRef.current === 1) ? (height / 2) : (height / (stripeCount + 1));

        const x = xOffset + canvasTextPosXOffset;
        const y = (appliedStripeStepsRef.current === 1) ? yOffset : (yOffset - yOffset / 2);
        setCanvasTextPos(new Vector2(x, y));
    }

    function updateCanvasSize() {
        const width = canvasContainerRef.current?.clientWidth!;
        const height = canvasContainerRef.current?.clientHeight!;

        setCanvasSize(new Vector2(width, height + canvasSizeAddPx));
        initFloatingKeySize();
        
        clearCanvas();
        reconstructMessage();
        updateCanvasTextPos();
        if (props.onCanvasResize) props.onCanvasResize();
    }

    function getCanvasWidth(): number {
        return canvasRef.current?.width!;
    }

    function getCanvasContext(): CanvasRenderingContext2D | null | undefined {
        return canvasRef?.current?.getContext("2d");
    }

    function unNormalizePos(pos: Vector2): Vector2 {
        const height = originalCanvasHeight < 0 ? canvasSize.y : originalCanvasHeight;
        return new Vector2(pos.x * getCanvasWidth(), pos.y * height);
    }

    function getStripes() {

        const stripeColor = props.userColor ? props.userColor : "green";

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

    function getNameRect(): DOMRect | null {
        if (!nameContainerRef || !nameContainerRef.current) return null;
        return nameContainerRef.current.getBoundingClientRect();
    }

    function getStripeRects() {
        const rects = [];
        for (let i = 0; i < stripesContainerRef.current!.children.length; i++) {
            rects.push(stripesContainerRef.current!.children[i].getBoundingClientRect());
        }

        return rects;
    }

    function getMessageCommands() {
        return props.message.getCommands();
    }

    function buildCanvasSketchFullAPI(): CanvasSketchFullAPI {
        return {
            ...props.sketchProperties!.api,
            drawPushStroke,
            drawPushText,
            drawPushImage,
            createAppendFloatingKeyImage,
            reconstructMessage,
            clearCanvas,
            setCanvasTextPos,
            incrementCanvasTextPosX
        };
    }

    function buildCanvasDisplayAPI(): CanvasDisplayAPI {
        return {
            setStripeSteps,
            setRenderStripes,
            setDrawOffsetY,
            getStripeRects,
            getNameRect,
            getMessageCommands
        }
    }

    function buildCanvasSpecialAPI(): CanvasSpecialFullAPI {
        return {
            ...props.specialProperties!.api,
            setStripeSteps,
            setRenderStripes,
            setCanvasTextPos,
            createAppendFloatingKeyImage,
            reconstructMessage
        }
    }

    function setStripeSteps(steps: number) {
        if (steps < 1) steps = 1;
        else if (steps > stripeCount) return;
        appliedStripeStepsRef.current = steps;

        const currentHeightPx = canvasContainerRef.current!.getBoundingClientRect().height;
        setOriginalCanvasHeight(currentHeightPx);

        const stepsRatio = steps / (stripeCount + 1);
        const heightPercent = props.defaultHeightPercent * stepsRatio;
        setContainerHeightPercent(heightPercent);
    }

    function incrementCanvasTextPosX(incrementFrom?: Vector2) {
        const maxWidth = canvasContainerRef.current?.clientWidth! - canvasTextPosXOffset;
        const pos = incrementFrom ? incrementFrom : canvasTextPosRef.current;
        pos.x += buttonWidth;

        if (pos.x >= maxWidth) {
            pos.x = canvasTextPosXOffset;
            pos.y = canvasTextPosRef.current.y + canvasContainerRef?.current?.clientHeight! / (stripeCount + 1);
        }

        setCanvasTextPos(pos);
    }

    function reconstructMessage() {
        if(ongoingReconstruct) {
            ongoingReconstruct.abort();
        }

        const ac = new AbortController();
        setOngoingReconstruct(ac);
        handleReconstructMessage(ac.signal);
    }

    async function handleReconstructMessage(signal: AbortSignal) {
        if (!props.message) return;

        const drawingCommands = props.message.getCommands();

        for (let i = 0; i < drawingCommands.length; i++) {
            if(signal.aborted) return;
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
                if (command.getValue().endsWith(".png")) {
                    // Command Value should already be a src path.
                    src = command.getValue();
                } else {
                    const rep = props.findCharRepFromValue(command.getValue());
                    if (rep) src = rep.src;
                }
                if (!src) continue;

                const width = Math.abs(posEnd.x - posStart.x);
                const height = Math.abs(posEnd.y - posStart.y);
                const img = await createImage(src, undefined, new Vector2(width, height));

                if(signal.aborted) return;

                drawImage(img, posStart, command.getPenColor());
            } else {
                drawText(posStart, command.getValue());
            }
        }

        setOngoingReconstruct(null);
        updateCanvasTextPos();
    }

    async function createImage(src: string, value?: string, size?: Vector2): Promise<HTMLImageElement> {
        return new Promise((resolve) => {
            const width = size ? size.x : buttonWidth;
            const height = size ? size.y : buttonWidth;

            const img = document.createElement("img") as HTMLImageElement;
            img.src = src;
            img.width = Math.round(width);      // Img-style-width automatically rounds; Img-width does not.
            img.height = Math.round(height);
            if (value) img.alt = value;

            img.onload = () => {
                resolve(img);
            }
        })
    }

    function clearCanvas() {
        const context = getCanvasContext();
        const height = canvasRef.current?.height!;
        context?.clearRect(0, 0, getCanvasWidth(), height);
    }

    async function createAppendFloatingKeyImage(src: string, value: string, colorFill: string) {
        const img = await createImage(src, value);
        drawPushImage(img, canvasTextPosRef.current, colorFill);
        incrementCanvasTextPosX();
    }

    function drawText(pos: Vector2, value: string) {
        const context = getCanvasContext();
        if (!context) return;

        const maxWidth = getCanvasWidth();

        context.font = "16px Courier New";
        context.fillStyle = "#AAA";
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

        const space = "space";
        if (img.src.toLowerCase().includes(space) || img.alt.toLowerCase().includes(space)) return;

        const buffer = document.createElement("canvas");
        buffer.width = img.width;
        buffer.height = img.height;

        const bufferContext = buffer.getContext("2d")!;
        bufferContext.imageSmoothingEnabled = false;
        bufferContext.drawImage(img, 0, 0, img.width, img.height);
        bufferContext.fillStyle = colorFill;
        bufferContext.globalCompositeOperation = "source-atop";
        bufferContext.fillRect(0, 0, buffer.width, buffer.height);

        context.imageSmoothingEnabled = false;
        context.drawImage(buffer, pos.x, pos.y, buffer.width, buffer.height);
        context.imageSmoothingEnabled = true;
    }

    function normalizeCanvasPos(canvasPos: Vector2): Vector2 {
        const width = getCanvasWidth();
        const height = originalCanvasHeight < 0 ? canvasSize.y : originalCanvasHeight;

        return new Vector2(canvasPos.x / width, canvasPos.y / height);
    }

    function pushMessageCommand(type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) {
        if (props.sketchProperties) {
            props.sketchProperties.api.pushMessageCommand(type, startPos, endPos, value, penSize, penColor);
        } else if (props.specialProperties) {
            props.specialProperties.api.pushMessageCommand(type, startPos, endPos, value, penSize, penColor);
        }
    }

    function drawPushStroke(posSrc: Vector2, posDst: Vector2, penSize: number, penColor: string) {
        if (!props.sketchProperties && !props.specialProperties) {
            console.log("ERROR: Unhandled case of calling drawPush* function with no sketchProperties!");
            return;
        }

        const drawDot = posSrc.equals(posDst);
        drawStroke(posSrc, posDst, drawDot, penSize, penColor);
        pushMessageCommand(DrawingCommandType.LINE_STROKE, normalizeCanvasPos(posSrc), normalizeCanvasPos(posDst), "", penSize, penColor);
    }

    function drawPushText(pos: Vector2, value: string) {
        if (!props.sketchProperties && !props.specialProperties) {
            console.log("ERROR: Unhandled case of calling drawPush* function with no sketchProperties!");
            return;
        }

        drawText(pos, value);
        const normalizedPos = normalizeCanvasPos(pos);
        pushMessageCommand(DrawingCommandType.TEXT, normalizedPos, normalizedPos, value, 0.0, "#000");
    }

    function drawPushImage(img: HTMLImageElement, pos: Vector2, colorFill: string) {
        if (!props.sketchProperties && !props.specialProperties) {
            console.log("ERROR: Unhandled case of calling drawPush* function with no sketchProperties!");
            return;
        }

        drawImage(img, pos, colorFill);
        const normalizedStartPos = normalizeCanvasPos(pos);
        const normalizedEndPos = normalizeCanvasPos(new Vector2(pos.x + img.width, pos.y + img.height));
        const value = img.alt.length > 0 ? img.alt : img.src;
        pushMessageCommand(DrawingCommandType.FLOATING_KEY, normalizedStartPos, normalizedEndPos, value, 0.0, colorFill);
    }

    function getCanvasSubComponent() {
        const className = "canvasTypeContainer";

        switch (props.canvasType) {
            case CanvasTypes.CANVAS_SKETCH:
                if (!props.sketchProperties) return (
                    <></>
                );

                return (
                    <CanvasSketch
                        className={className}
                        canvasText={props.sketchProperties.canvasText}
                        canvasSketchRef={props.sketchProperties.canvasSketchRef}
                        canvasTextPos={canvasTextPosRef.current}
                        api={buildCanvasSketchFullAPI()}
                    />
                );
            case CanvasTypes.CANVAS_DISPLAY:
                return (
                    <CanvasDisplay
                        className={className}
                        api={buildCanvasDisplayAPI()}
                    />
                );
            case CanvasTypes.CANVAS_SPECIAL:
                if (!props.specialProperties) return (
                    <></>
                );

                return (
                    <CanvasSpecial
                        className={className}
                        messageText={props.specialProperties.messageText}
                        textColor={props.specialProperties.textColor}
                        api={buildCanvasSpecialAPI()}
                    />
                )
            default:
                return (
                    <></>
                );
        }
    }

    return (
        <div 
        ref={canvasContainerRef}
        style={{
            display: "flex",
            height: `${containerHeightPercent}%`,
            aspectRatio: "16 / 9",
            margin: `${props.canvasType === CanvasTypes.CANVAS_SKETCH ? 0 : canvasDisplayMarginPx}px auto`,
        }}
        >
            <div className="canvasContainer">
                <div className="canvasBackground">

                </div>
                {renderStripes ? (
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

                {getCanvasSubComponent()}

                <div className="borderContainer">
                    {props.hideName ? (
                        <></>
                    ) : (
                        <div className="nameContainer" ref={nameContainerRef}>
                            <label>{props.message.getUsername()}</label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Canvas;
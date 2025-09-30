import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import './MessageSketch.css'
import { Message } from './Message';
import { Vector2 } from './Vector2';
import { DrawingCommandType } from './DrawCommand';
import CanvasShared from './CanvasShared';

const stripeCount = 4;

const colorBackground = "#FFF";
const colorForeground = "#000";
const sizeSmall = 1.0;
const sizeLarge = 3.0;
const rainbowPhaseR = 0;
const rainbowPhaseG = 2;
const rainbowPhaseB = 4;

const canvasTextPosXOffset = 5;

/**
 * Takes a single value between 0 and 255 and turns it into a 2-digit hex representation.
 * @param b Color value between 0 and 255.
 * @returns 2-digit hex-representation of that value.
 */
function byteToHex(b: number): string {
    const str = "0123456789ABCDEF";
    const subStrFirst = (b >> 4) & 0x0F;
    const subStrSecond = b & 0x0F;
    return str.substring(subStrFirst, subStrFirst + 1) + str.substring(subStrSecond, subStrSecond + 1);
}

/**
 * Takes three RGB values between 0 and 255 and turns them in a 6-digit hex-representation.
 * @param r Red color value.
 * @param g Green color value.
 * @param b Blue color value.
 * @returns 6-digit hex-representation of the RGB values, with '#' as the prefix. E.g. #12ABCD
 */
function rgbToColor(r: number, g: number, b: number): string {
    return "#" + byteToHex(r) + byteToHex(g) + byteToHex(b);
}

function MessageSketch({canvasText, canvasRef, username, addMessage, findCharRepFromValue, getBottomScrollMessage}: any) {

    const [mouseDown, setMouseDown] = useState(false);
    const [posX, setPosX] = useState(-1);
    const [posY, setPosY] = useState(-1);
    const [prevPosX, setPrevPosX] = useState(-1);
    const [prevPosY, setPrevPosY] = useState(-1);

    const sketchContainerRef = useRef<HTMLDivElement>(null);
    const nameContainerRef = useRef<HTMLDivElement>(null);
    const canvasSharedRef = useRef<any>(null);

    const [canvasTextPosX, setCanvasTextPosX] = useState(-1);
    const [canvasTextPosY, setCanvasTextPosY] = useState(-1);

    const [floatingKeyValue, setFloatingKeyValue] = useState("");
    const [floatingKeyPos, setFloatingKeyPos] = useState({
        x: 0,
        y: 0
    });

    const [message, setMessage] = useState(new Message([], username));

    const [penSize, setPenSize] = useState(sizeLarge);
    const [penColor, setPenColor] = useState(colorForeground);
    const [penRainbow, setPenRainbow] = useState(false);
    const [rainbowTick, setRainbowTick] = useState(0);


    useImperativeHandle(canvasRef, () => ({
        drawText(text: string, screenX: number, screenY: number) {
            setFloatingKeyPos({
                x: screenX,
                y: screenY
            })
            setFloatingKeyValue(text);
        },

        drawImg(img: HTMLImageElement, screenX: number, screenY: number, colorFill: string) {
            handleFloatingKeyImage(img, new Vector2(screenX, screenY), colorFill);
        },

        usePenDraw() {
            setPenDraw();
        },

        usePenErase() {
            setPenErase();
        },

        usePenSmall() {
            setPenSmall();
        },

        usePenBig() {
            setPenBig();
        },

        sendMessage() {
            sendCurrentMessage();
        },

        copyMessage() {
            copyOnCanvas();
        },

        discardMessage() {
            canvasSharedRef.current!.clearCanvas();
        },

        getLastTextValue(): string | null {
            return message.getLastTextValue();
        },

        replaceLastTextValue(newVal: string) {
            replaceLastMessageText(newVal);
        }
    }));

    useEffect(() => {
        handleStrokePosChange();
    }, [posX, posY]);

    useEffect(() => {
        handleCanvasTextChange();
    }, [canvasText]);

    useEffect(() => {
        handleFloatingKeyAttachment();
    }, [floatingKeyValue, floatingKeyPos]);

    async function sendCurrentMessage() {
        addMessage(message);
        await postMessage(message);
        canvasSharedRef.current!.clearCanvas();
        setMessage(new Message([], username));
    }

    function replaceLastMessageText(newVal: string) {
        const oldVal = message.removeLastTextCommand();
        if (!oldVal) return;

        message.pushCommand(oldVal.getType(), oldVal.getStartPos(), oldVal.getEndPos(), newVal, oldVal.getPenSize(), oldVal.getPenColor());
        canvasSharedRef.current!.clearCanvas();
        canvasSharedRef.current!.reconstructMessage();
    }

    function copyOnCanvas() {
        const msg = getBottomScrollMessage() as Message;
        message.concatCommands(msg.getCommands());
        canvasSharedRef.current!.reconstructMessage();
    }

    function unNormalizePos(pos: Vector2): Vector2 {
        const width = sketchContainerRef.current?.clientWidth!;
        const height = sketchContainerRef.current?.clientHeight!;
        return new Vector2(pos.x * width, pos.y * height);
    }

    /**
     * Draws a stroke onto the Canvas based on the previous and current cursor position.
     */
    function handleStrokePosChange() {
        const offsetTop = sketchContainerRef.current?.offsetTop!;
        const offsetLeft = sketchContainerRef.current?.offsetLeft!;

        const drawDot = prevPosX < 0;

        const posPrev: Vector2 = new Vector2(prevPosX - offsetLeft, prevPosY - offsetTop);
        const pos: Vector2 = new Vector2(posX - offsetLeft, posY - offsetTop);
        const posFirst: Vector2 = drawDot ? pos : posPrev;

        if (posFirst.x < 0 || posFirst.y < 0) return;

        if (penRainbow && !isPenErase()) {
            setPenColor(tickRainbow());
        }

        drawPushStroke(posFirst, pos, penSize, penColor);


        setPrevPosX(posX);
        setPrevPosY(posY);
    }

    /**
     * Draws the dragged Floating Key onto the Canvas.
     */
    function handleFloatingKeyAttachment() {
        // Drawn FloatingKey value onto canvas is slightly offset from the dragged one,
        //  resulting in a "pop effect". This offset makes the position accurate again.
        const offsetPopFixY = -13;
        const offsetTop = sketchContainerRef.current?.offsetTop! + offsetPopFixY;
        const offsetLeft = sketchContainerRef.current?.offsetLeft!;

        const pos: Vector2 = new Vector2(floatingKeyPos.x - offsetLeft, floatingKeyPos.y - offsetTop);

        if (pos.x < 0 || pos.y < 0) return;

        const value: string = floatingKeyValue;

        setCanvasTextPosX(pos.x);
        setCanvasTextPosY(pos.y);

        drawPushText(pos, value);
    }

    function handleFloatingKeyImage(img: HTMLImageElement, screenPos: Vector2, colorFill: string) {
        const offsetTop = sketchContainerRef.current?.offsetTop!;
        const offsetLeft = sketchContainerRef.current?.offsetLeft!;
        const pos: Vector2 = new Vector2(screenPos.x - offsetLeft, screenPos.y - offsetTop);

        // Ignore Image that would be too far out of bounds.
        const canvasRight = sketchContainerRef.current!.offsetWidth;
        const canvasBottom = sketchContainerRef.current!.offsetHeight;
        const imgRight = pos.x + img.width;
        const imgBottom = pos.y + img.height;

        if (imgRight < 0 || pos.x > canvasRight || imgBottom < 0 || pos.y > canvasBottom) return;

        // Set pos to the right and vertical center of the image.
        setCanvasTextPosX(imgRight);
        setCanvasTextPosY((pos.y + imgBottom) / 2);

        drawPushImage(img, pos, colorFill);
    }

    /**
     * Draws a char onto the Canvas upon pressing a Button on the Virtual Keyboard 
     *  or typing a key on the physical keyboard.
     */
    function handleCanvasTextChange() {
        const value: string = canvasText.charAt(canvasText.length - 1);

        if (value === "\b") {
            const command = message.removeLastTextCommand();
            if (!command) return;
            if (command.getValue().length !== 1) return;

            const pos = unNormalizePos(command.getStartPos());
            setCanvasTextPosX(pos.x);
            setCanvasTextPosY(pos.y);

            canvasSharedRef.current!.clearCanvas();
            canvasSharedRef.current!.reconstructMessage(message);
            return;
        }

        const pos: Vector2 = new Vector2(canvasTextPosX, canvasTextPosY);

        if (pos.x < 0 || pos.y < 0) return;

        const width = sketchContainerRef.current?.clientWidth!;
        const maxWidth = width - canvasTextPosXOffset;

        if (pos.x >= maxWidth) {
            pos.x = canvasTextPosXOffset;
            pos.y = canvasTextPosY + sketchContainerRef?.current?.clientHeight! / (stripeCount + 1);
            setCanvasTextPosX(pos.x);
            setCanvasTextPosY(pos.y);
        }

        const incrementX = 8;
        setCanvasTextPosX(prev => prev + incrementX);

        drawPushText(pos, value);
    }

    function handleCanvasResize() {
        const height = sketchContainerRef.current?.clientHeight!;
        const h = height / (stripeCount + 1);
        const w = nameContainerRef.current?.clientWidth!;
        setCanvasTextPosX(w + canvasTextPosXOffset);
        setCanvasTextPosY(h - h / 2);
    }

    function isPenErase() {
        return penColor === colorBackground;
    }

    function setPenSmall() {
        setPenSize(sizeSmall);
    }

    function setPenBig() {
        setPenSize(sizeLarge);
    }

    function setPenDraw() {
        if (penColor === colorForeground) {
            setPenRainbow(true);
        } else {
            setPenColor(colorForeground);

            if (!isPenErase()) {
                setPenRainbow(false);
            }
        }
    }

    function setPenErase() {
        setPenColor(colorBackground);
    }

    /**
     * Increments the rainbow ticks and returns an RGB value of the current ticks color.
     * @returns Hex-representation of the RGB values for the current color of the rainbow.
     */
    function tickRainbow(): string {
        const freq = 0.31415;
        const maxTicks = 32;
        setRainbowTick(prev => prev >= maxTicks ? 0 : prev + 1);

        const r = Math.sin(freq * rainbowTick + rainbowPhaseR) * 127 + 128;
        const g = Math.sin(freq * rainbowTick + rainbowPhaseG) * 127 + 128;
        const b = Math.sin(freq * rainbowTick + rainbowPhaseB) * 127 + 128;

        return rgbToColor(r, g, b);
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
        const width = sketchContainerRef.current?.clientWidth!;
        const height = sketchContainerRef.current?.clientHeight!;

        return new Vector2(canvasPos.x / width, canvasPos.y / height);
    }

    function drawPushText(pos: Vector2, value: string) {
        canvasSharedRef.current!.drawText(pos, value);
        const normalizedPos = normalizeCanvasPos(pos);
        message.pushCommand(DrawingCommandType.TEXT, normalizedPos, normalizedPos, value, penSize, penColor);
    }

    function drawPushStroke(posSrc: Vector2, posDst: Vector2, size: number, color: string) {
        canvasSharedRef.current!.drawStroke(posSrc, posDst, size, color);
        message.pushCommand(DrawingCommandType.LINE_STROKE, normalizeCanvasPos(posSrc), normalizeCanvasPos(posDst), "", penSize, penColor);
    }

    function drawPushImage(img: HTMLImageElement, pos: Vector2, colorFill: string) {
        canvasSharedRef.current!.drawImage(img, pos, colorFill);
        const normalizedStartPos = normalizeCanvasPos(pos);
        const normalizedEndPos = normalizeCanvasPos(new Vector2(pos.x + img.width, pos.y + img.height));
        const value = img.alt.length > 0 ? img.alt : img.src;
        message.pushCommand(DrawingCommandType.FLOATING_KEY, normalizedStartPos, normalizedEndPos, value, penSize, penColor);
    }

    return (
        <div className="messageSketchContainer" ref={sketchContainerRef}
            onMouseDown={canvas_mousedown}
            onMouseUp={canvas_mouseup}
            onMouseMove={canvas_mousemove}
            onMouseEnter={canvas_mouseenter}
            onMouseLeave={canvas_mouseleave}
        >
            <CanvasShared
                canvasSharedRef={canvasSharedRef}
                nameContainerRef={nameContainerRef}
                message={message}
                onCanvasResize={handleCanvasResize}
                findCharRepFromValue={findCharRepFromValue}
                showStripes={true}
                showName={true}
            />
        </div>
    );
}

export default MessageSketch;
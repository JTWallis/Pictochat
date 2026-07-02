import { useEffect, useImperativeHandle, useRef } from 'react';
import './CanvasSketch.css'
import { Vector2 } from '@models/Vector2';
import type { CanvasSketchFullAPI } from '../CanvasAPI';
import { getTickRainbowHex, incrementTickRainbow } from '@utils/RainbowHelper';

const colorBackground = "#FFF";
const colorForeground = "#000";
const sizeSmall = 1.0;
const sizeLarge = 3.0;
const incrImgSizeRatio = 0.75;

interface CanvasSketchProps {
    className: string,
    canvasText: string,
    canvasSketchRef: React.RefObject<any>,
    canvasTextPos: Vector2,
    api: CanvasSketchFullAPI
};

function CanvasSketch(props: CanvasSketchProps) {

    let mouseDown = false;
    let mousePos = new Vector2(-1, -1);
    let mousePrevPos = new Vector2(-1, -1);

    const sketchContainerRef = useRef<HTMLDivElement>(null);
    const penSizeRef = useRef<number>(sizeLarge);
    const penColorRef = useRef<string>(colorForeground);
    const penRainbowRef = useRef<boolean>(false);
    const rainbowTickRef = useRef<number>(0);


    useImperativeHandle(props.canvasSketchRef, () => ({
        drawImg(img: HTMLImageElement, screenX: number, screenY: number, colorFill: string) {
            handleFloatingKeyImage(img, new Vector2(screenX, screenY), colorFill);
        },

        createDrawImgAppend(src: string, value: string, colorFill: string) {
            props.api.createAppendFloatingKeyImage(src, value, colorFill);
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
            resetCanvas();
        },

        getLastTextValue(): string | null {
            const lastText = props.api.getLastMessageText();
            return lastText ? lastText.getValue() : null;
        },

        replaceLastTextValue(newVal: string) {
            replaceLastMessageText(newVal);
        }
    }));

    useEffect(() => {
        handleCanvasTextChange();
    }, [props.canvasText]);


    function resetCanvas() {
        props.api.resetMessage();
        props.api.clearCanvas();
    }

    function sendCurrentMessage() {
        props.api.sendMessage();
        resetCanvas();
    }

    function replaceLastMessageText(newVal: string) {
        const oldVal = props.api.removeLastMessageTextCommand();
        if (!oldVal) return;

        props.api.pushMessageCommand(oldVal.getType(), oldVal.getStartPos(), oldVal.getEndPos(), newVal, oldVal.getPenSize(), oldVal.getPenColor());
        props.api.clearCanvas();
        props.api.reconstructMessage();
    }

    function copyOnCanvas() {
        const success = props.api.concatBottomScrollMessage();
        if(!success) return;
        
        props.api.reconstructMessage();
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
        if(mousePos.x < 0 || mousePos.y < 0) return;

        const offsetTop = sketchContainerRef.current?.offsetTop!;
        const offsetLeft = sketchContainerRef.current?.offsetLeft!;

        const drawDot = mousePrevPos.x < 0;

        const posPrev: Vector2 = new Vector2(mousePrevPos.x - offsetLeft, mousePrevPos.y - offsetTop);
        const pos: Vector2 = new Vector2(mousePos.x - offsetLeft, mousePos.y - offsetTop);
        const posFirst: Vector2 = drawDot ? pos : posPrev;

        if (posFirst.x < 0 || posFirst.y < 0) return;

        if (penRainbowRef.current && !isPenErase()) {
            penColorRef.current = tickRainbow();
        }

        props.api.drawPushStroke(posFirst, pos, penSizeRef.current, penColorRef.current);


        setMousePrevPos(mousePos.x, mousePos.y);
    }

    function handleFloatingKeyImage(img: HTMLImageElement, screenPos: Vector2, colorFill: string) {
        const offsetTop = sketchContainerRef.current?.offsetTop!;
        const offsetLeft = sketchContainerRef.current?.offsetLeft!;
        const pos: Vector2 = new Vector2(screenPos.x - offsetLeft, screenPos.y - offsetTop);

        // Ignore Image that would be too far out of bounds.
        const canvasRight = sketchContainerRef.current!.offsetWidth;
        const canvasBottom = sketchContainerRef.current!.offsetHeight;
        const imgRight = pos.x + img.width * incrImgSizeRatio;
        const imgBottom = pos.y + img.height;

        if (imgRight < 0 || pos.x > canvasRight || imgBottom < 0 || pos.y > canvasBottom) return;

        // Set pos to the right and vertical center of the image.
        props.api.setCanvasTextPos(new Vector2(imgRight, (pos.y + imgBottom) / 2));

        props.api.drawPushImage(img, pos, colorFill);
    }

    /**
     * Draws a char onto the Canvas upon pressing a Button on the Virtual Keyboard 
     *  or typing a key on the physical keyboard.
     */
    function handleCanvasTextChange() {
        const value: string = props.canvasText.charAt(props.canvasText.length - 1);

        if (value === "\b") {
            const command = props.api.removeLastMessageTextCommand();
            if (!command) return;
            if (command.getValue().length !== 1) return;

            props.api.clearCanvas();
            props.api.reconstructMessage();
        } else if(value === " ") {
            props.api.pushWhitespace();
        }
    }

    function isPenErase() {
        return penColorRef.current === colorBackground;
    }

    function setPenSmall() {
        penSizeRef.current = sizeSmall;
    }

    function setPenBig() {
        penSizeRef.current = sizeLarge;
    }

    function setPenDraw() {
        if (penColorRef.current === colorForeground) {
            penRainbowRef.current = true;
        } else {
            penColorRef.current = colorForeground;

            if (!isPenErase()) {
                penRainbowRef.current = false;
            }
        }
    }

    function setPenErase() {
        penColorRef.current = colorBackground;
    }

    /**
     * Increments the rainbow ticks and returns an RGB value of the current ticks color.
     * @returns Hex-representation of the RGB values for the current color of the rainbow.
     */
    function tickRainbow(): string {
        const hex = getTickRainbowHex(rainbowTickRef.current);
        rainbowTickRef.current = incrementTickRainbow(rainbowTickRef.current);
        return hex;
    }

    function setMousePos(x: number, y: number) {
        mousePos.x = x;
        mousePos.y = y;

        handleStrokePosChange();
    }

    function setMousePosPage(event: MouseEvent) {
        setMousePos(event.pageX, event.pageY);
    }

    function setMousePrevPos(x: number, y: number) {
        mousePrevPos.x = x;
        mousePrevPos.y = y;
    }

    function resetPos() {
        setMousePos(-1, -1);
        setMousePrevPos(-1, -1);
    }

    function canvas_mousedown(event: any) {
        mouseDown = true;
        setMousePosPage(event);
    }

    function canvas_mousemove(event: any) {
        if (!mouseDown) return;
        setMousePosPage(event);
    }

    function canvas_mouseup(event: any) {
        mouseDown = false;
        resetPos();
    }

    function canvas_mouseenter(event: any) {
        if (!mouseDown) return;
        setMousePosPage(event);
    }

    function canvas_mouseleave(event: any) {
        if (!mouseDown) return;

        //draw(event);

        //prevX = null;
        //prevY = null;
    }


    return (
        <div className={props.className} ref={sketchContainerRef}
            onMouseDown={canvas_mousedown}
            onMouseUp={canvas_mouseup}
            onMouseMove={canvas_mousemove}
            onMouseEnter={canvas_mouseenter}
            onMouseLeave={canvas_mouseleave}
        >
        </div>
    );
}

export default CanvasSketch;
import type { CanvasSketchHandle } from '@components/message/canvas/CanvasSketch';
import './FloatingKey.css'
import { useImperativeHandle, useRef, useState } from "react";


const VISIBLE = "visible";
const HIDDEN = "hidden";

type FloatingKeyProps = {
    ref: React.Ref<FloatingKeyHandle>,
    canvasSketchRef: React.RefObject<CanvasSketchHandle | null>
}

export type FloatingKeyHandle = {
    setPos: (x: number, y: number) => void;
    setChar: (char: string) => void;
    setImg: (src: string, value: string) => void;
    setSize: (size: number) => void;
    apply: () => void;
}

/**
 * A FloatingKey represents a temporary sprite, that is dragged onto the CanvasSketch area to draw it.
 * It stays invisible, until a non-special character from the virtual keyboard is clicked,
 * and dragged while holding down the left mouse button.
 * During that state, it will become an HtmlImage element of the character and follow the mouse cursor.
 * After drawing, it becomes invisible again.
 */
function FloatingKey(props: FloatingKeyProps) {

    const [posX, setPosX] = useState<number>(0);
    const [posY, setPosY] = useState<number>(0);
    const [labelValue, setLabelValue] = useState("");
    const [labelVisible, setLabelVisible] = useState(true);
    const [imgSrc, setImgSrc] = useState("");
    const [imgSize, setImgSize] = useState(10);
    const [imgVisible, setImgVisible] = useState(true);

    const [imgDrawColor, setImgDrawColor] = useState("#000");
    const imageRef = useRef<HTMLImageElement>(null);

    useImperativeHandle(props.ref, () => ({
        setPos: (x: number, y: number) => {
            setPosX(x);
            setPosY(y);
        },

        setChar: (char: string) => {
            setLabelVisible(true);
            setImgVisible(false);
            setLabelValue(char);

            
        },

        setImg: (src: string, value: string) => {
            setImage(src, value);
        },

        setSize: (size: number) => {
            setImgSize(size);
        },

        apply: () => {
            props.canvasSketchRef.current!.drawImg(imageRef.current!, posX, posY, imgDrawColor);
            hide();
            resetPos();
        }
    }));

    function hide() {
        setLabelVisible(false);
        setImgVisible(false);
    }

    function resetPos() {
        setPosX(-100);
        setPosY(-100);
    }

    function setImage(src: string, value: string) {
        setLabelVisible(false);
        setImgVisible(true);
        setImgSrc(src);
        if(value) setLabelValue(value);
    }

    return (
        <div
            style={{
                position: "absolute",
                top: posY,
                left: posX
            }}
        >
            <label
                className="absolute"
                style={{
                    visibility: labelVisible ? VISIBLE : HIDDEN
                }}
            >
                {labelValue}
            </label>
            <img
                src={imgSrc}
                alt={labelValue}
                className="absolute image"
                ref={imageRef}
                style={{
                    visibility: imgVisible ? VISIBLE : HIDDEN,
                    width: Math.round(imgSize),
                    height: Math.round(imgSize)
                }} />
        </div>
    );
};

export default FloatingKey;
import './FloatingKey.css'
import { useImperativeHandle, useRef, useState } from "react";


const VISIBLE = "visible";
const HIDDEN = "hidden";

function FloatingKey(props: any) {

    const [posX, setPosX] = useState<number>(0);
    const [posY, setPosY] = useState<number>(0);
    const [labelValue, setLabelValue] = useState("");
    const [labelVisible, setLabelVisible] = useState(true);
    const [imgSrc, setImgSrc] = useState("");
    const [imgSize, setImgSize] = useState(10);
    const [imgVisible, setImgVisible] = useState(true);

    const [imgDrawColor, setImgDrawColor] = useState("#000");
    const imageRef = useRef<HTMLImageElement>(null);

    useImperativeHandle(props.floatingKeyRef, () => ({
        setPos: (x: number, y: number) => {
            setPosX(x);
            setPosY(y);
        },

        setChar: (char: string) => {
            setLabelVisible(true);
            setImgVisible(false);
            setLabelValue(char);

            
        },

        setImg: (src: string, size: number, value: string) => {
            setLabelVisible(false);
            setImgVisible(true);
            setImgSrc(src);
            setImgSize(size);
            if(value) setLabelValue(value);
        },

        setSize: (size: number) => {
            setImgSize(size);
        },

        apply: () => {
            // Draw value of FloatingKey onto canvas.
            if(labelVisible) {
                props.canvasSketchRef.current.drawText(labelValue, posX, posY);
            } else if(imgVisible) {
                props.canvasSketchRef.current.drawImg(imageRef.current, posX, posY, imgDrawColor);
            }

            // Hide FloatingKey
            setLabelVisible(false);
            setImgVisible(false);
            setPosX(-100);
            setPosY(-100);
        }
    }));

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
                    width: imgSize,
                    height: imgSize
                }} />
        </div>
    );
};

export default FloatingKey;
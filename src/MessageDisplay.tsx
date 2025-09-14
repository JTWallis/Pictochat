import { useEffect, useRef, useState } from 'react';
import './MessageDisplay.css';

function MessageDisplay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const nameContainerRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(300);
    const [canvasHeight, setCanvasHeight] = useState(150);

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

    function setCanvasSize(width: number, height: number) {
        setCanvasWidth(width);
        setCanvasHeight(height);
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
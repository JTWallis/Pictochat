import { useEffect, useRef, useState } from "react";
import type { CanvasSpecialFullAPI } from "./CanvasAPI";
import type { CharRepresentation } from "./CharRepresentation";

interface CanvasSpecialProps {
    className: string,
    messageText: string,
    textColor: string,
    api: CanvasSpecialFullAPI
}

function CanvasSpecial(props: CanvasSpecialProps) {

    const canvasContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div 
            className={props.className} 
            ref={canvasContainerRef}
        >
        </div>
    );
}

export default CanvasSpecial;
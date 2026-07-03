import { useEffect, useRef, useState } from "react";
import type { CanvasSpecialFullAPI } from "./CanvasAPI";
import type { CharRepresentation } from "@models/charrepresentations/CharRepresentation";

type CanvasSpecialProps = {
    className: string,
    messageText: string,
    textColor: string,
    api: CanvasSpecialFullAPI
}

/**
 * A CanvasDisplay is responsible for displaying special messages.
 * It is wrapped in a {@link MessageSpecial} component.
 * This component essentially constructs a {@link Message} out of a list of
 * {@link CharRepresentation}, sets its size to the minimum height-step
 * and paints the background black.
 */
function CanvasSpecial(props: CanvasSpecialProps) {

    const [firstMount, setFirstMount] = useState(false);
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initHeight();
    }, []);

    useEffect(() => {
        if(firstMount) initMessage();
    }, [canvasContainerRef.current?.clientHeight]);

    function initHeight() {
        setFirstMount(true);
        props.api.setStripeSteps(1);
        props.api.setRenderStripes(false);
    }

    async function initMessage() {
        setFirstMount(false);
        const charReps: CharRepresentation[] = props.api.convertTextToCharReps(props.messageText);

        for(let charRep of charReps) {
            await props.api.createAppendFloatingKeyImage(charRep.src, charRep.value, props.textColor);
        }
    }

    return (
        <div 
            className={props.className} 
            ref={canvasContainerRef}
        >
        </div>
    );
}

export default CanvasSpecial;
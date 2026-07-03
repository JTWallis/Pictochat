import Canvas from "./canvas/Canvas";
import { CanvasTypes } from './canvas/CanvasAPI';
import { useContext } from 'react';
import { ThemeContext } from '@contexts/ThemeContext';
import type { CharRepresentation } from '@models/charrepresentations/CharRepresentation';
import type { Message } from '@models/Message';

const INIT_HEIGHT_PERCENT = 50;

type MessageDisplayProps = {
    message: Message,
    findCharRepFromValue: (value: string) => CharRepresentation | undefined;
}

function MessageDisplay(props: MessageDisplayProps) {

    const theme = useContext(ThemeContext);

    return (
        <Canvas 
            backgroundColor={theme.canvas}
            defaultHeightPercent={INIT_HEIGHT_PERCENT}
            canvasType={CanvasTypes.CANVAS_DISPLAY}
            message={props.message}
            findCharRepFromValue={props.findCharRepFromValue}
        />
    )
}

export default MessageDisplay;
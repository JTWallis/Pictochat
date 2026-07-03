import Canvas from './canvas/Canvas';
import { CanvasTypes, type CanvasSpecialPartialAPI } from './canvas/CanvasAPI';
import type { Vector2 } from '@models/Vector2';
import { useContext } from 'react';
import { ThemeContext } from '@contexts/ThemeContext';
import type { Message } from '@models/Message';
import type { CharRepresentation } from '@models/charrepresentations/CharRepresentation';

const INIT_HEIGHT_PERCENT = 50;

export type MessageSpecialProps = {
    message: Message,
    messageText: string,
    textColor: string,
    findCharRepFromValue: (value: string) => CharRepresentation | undefined;
    convertTextToCharReps: (text: string) => CharRepresentation[];
}

function MessageSpecial(props: MessageSpecialProps) {

    const api: CanvasSpecialPartialAPI = {
        convertTextToCharReps: props.convertTextToCharReps,
        pushMessageCommand
    }

    const theme = useContext(ThemeContext);

    function pushMessageCommand(type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) {
        props.message.pushCommand(type, startPos, endPos, value, penSize, penColor);
    }

    return (
        <Canvas
            defaultHeightPercent={INIT_HEIGHT_PERCENT}
            backgroundColor={theme.canvas_special}
            canvasType={CanvasTypes.CANVAS_SPECIAL}
            message={props.message} 
            findCharRepFromValue={props.findCharRepFromValue}
            hideName={true}
            specialProperties={{
                messageText: props.messageText,
                textColor: props.textColor,
                api: api
            }}
        />
    )

}

export default MessageSpecial;
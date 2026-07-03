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

/**
 * A MessageSpecial is an abstraction-wrapper between the App and a {@link CanvasSpecial}.
 * It delegates the props and preset configurations to the {@link Canvas}.
 * 
 * Ultimately it is responsible for constructing and displaying a special {@link Message}
 * from a message-string, by pushing multiple {@link DrawCommand}.
 * The Message instance still belongs to the caller.
 * It offers no sketching-capabilites, resizes itself to the minimum height-steps,
 * and paints the background-color black.
 */
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
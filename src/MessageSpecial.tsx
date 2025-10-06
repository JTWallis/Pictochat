import Canvas from './Canvas';
import './MessageSpecial.css';
import './MessageDisplay.css';
import { CanvasTypes, type CanvasSpecialPartialAPI } from './CanvasAPI';
import type { Vector2 } from './Vector2';

function MessageSpecial( {message, messageText, textColor, findCharRepFromValue, convertTextToCharReps}: any ) {

    const api: CanvasSpecialPartialAPI = {
        convertTextToCharReps,
        pushMessageCommand
    }

    function pushMessageCommand(type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) {
        message.pushCommand(type, startPos, endPos, value, penSize, penColor);
    }

    return (
        <Canvas
            className="messageDisplayContainer messageSpecialContainer"
            canvasType={CanvasTypes.CANVAS_SPECIAL}
            message={message} 
            findCharRepFromValue={findCharRepFromValue}
            hideName={true}
            specialProperties={{
                messageText: messageText,
                textColor,
                api: api
            }}
        />
    )

}

export default MessageSpecial;
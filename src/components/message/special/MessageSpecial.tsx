import Canvas from '../../../Canvas';
import './MessageSpecial.css';
import '../display/MessageDisplay.css';
import { CanvasTypes, type CanvasSpecialPartialAPI } from '../../../CanvasAPI';
import type { Vector2 } from '@models/Vector2';
import { useContext } from 'react';
import { ThemeContext } from '@contexts/ThemeContext';

const INIT_HEIGHT_PERCENT = 50;

function MessageSpecial( {message, messageText, textColor, findCharRepFromValue, convertTextToCharReps}: any ) {

    const api: CanvasSpecialPartialAPI = {
        convertTextToCharReps,
        pushMessageCommand
    }

    const theme = useContext(ThemeContext);

    function pushMessageCommand(type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) {
        message.pushCommand(type, startPos, endPos, value, penSize, penColor);
    }

    return (
        <Canvas
            defaultHeightPercent={INIT_HEIGHT_PERCENT}
            backgroundColor={theme.canvas_special}
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
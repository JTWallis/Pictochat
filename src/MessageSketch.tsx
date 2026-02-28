import './MessageSketch.css';
import Canvas from "./Canvas";
import { useContext, useState } from 'react';
import { Message } from '@models/Message';
import type { Vector2 } from './Vector2';
import type { DrawCommand } from '@models/DrawCommand';
import type { CanvasSketchPartialAPI } from './CanvasAPI';
import { CanvasTypes } from './CanvasAPI';
import { postMessage } from './MessageController';
import { ThemeContext } from './ThemeContext';

const INIT_HEIGHT_PERCENT = 100;

function MessageSketch({username, canvasText, getBottomScrollMessage, findCharRepFromValue, addMessage, canvasSketchRef, floatingKeyRef}: any) {

    const api: CanvasSketchPartialAPI = {
        pushMessageCommand,
        sendMessage,
        concatBottomScrollMessage,
        resetMessage,
        removeLastMessageTextCommand,
        getLastMessageText
    };

    const theme = useContext(ThemeContext);

    const [message, setMessage] = useState(new Message([], username));

    function pushMessageCommand(type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) {
        message.pushCommand(type, startPos, endPos, value, penSize, penColor);
    }

    function resetMessage() {
        setMessage(new Message([], username));
    }

    function sendMessage() {
        addMessage(message);
        postMessage(message);
    }

    function concatBottomScrollMessage(): boolean {
        const msg = getBottomScrollMessage() as Message;
        if(msg.isSpecialMessage()) return false;

        message.concatCommands(msg.getCommands());
        return true;
    }

    function removeLastMessageTextCommand(): DrawCommand | null {
        return message.removeLastTextCommand();
    }

    function getLastMessageText(): DrawCommand | null {
        return message.getLastText();
    }

    return (
        <Canvas 
            defaultHeightPercent={INIT_HEIGHT_PERCENT}
            backgroundColor={theme.canvas}
            canvasType={CanvasTypes.CANVAS_SKETCH}
            message={message}
            findCharRepFromValue={findCharRepFromValue}
            sketchProperties={{
                canvasText: canvasText,
                api: api,
                canvasSketchRef: canvasSketchRef,
                floatingKeyRef: floatingKeyRef
            }}

        />
    )
}

export default MessageSketch;
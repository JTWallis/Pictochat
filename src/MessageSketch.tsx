import './MessageSketch.css';
import Canvas from "./Canvas";
import { useState } from 'react';
import { Message } from './Message';
import type { Vector2 } from './Vector2';
import type { DrawCommand } from './DrawCommand';
import type { CanvasSketchPartialAPI } from './CanvasAPI';
import { CanvasTypes } from './CanvasAPI';
import { postMessage } from './MessageController';


function MessageSketch({username, canvasText, getBottomScrollMessage, findCharRepFromValue, addMessage, canvasSketchRef, floatingKeyRef}: any) {

    const api: CanvasSketchPartialAPI = {
        pushMessageCommand,
        sendMessage,
        concatBottomScrollMessage,
        resetMessage,
        removeLastMessageTextCommand,
        getLastMessageText
    };

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
        setMessage(new Message([], username));
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
            className="messageSketchContainer"
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
import './MessageSketch.css';
import Canvas from "./Canvas";
import { useState } from 'react';
import { Message } from './Message';
import type { Vector2 } from './Vector2';
import type { DrawCommand } from './DrawCommand';
import type { CanvasSketchPartialAPI } from './CanvasSketchAPI';


function MessageSketch({username, canvasText, getBottomScrollMessage, findCharRepFromValue, addMessage, canvasSketchRef}: any) {

    const api: CanvasSketchPartialAPI = {
        pushMessageCommand,
        sendMessage,
        concatBottomScrollMessage,
        removeLastMessageTextCommand,
        getLastMessageTextValue
    };

    const [message, setMessage] = useState(new Message([], username));

    function pushMessageCommand(type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) {
        message.pushCommand(type, startPos, endPos, value, penSize, penColor);
    }

    async function sendMessage() {
        addMessage(message);
        await postMessage(message);
        setMessage(new Message([], username));
    }

    function concatBottomScrollMessage() {
        const msg = getBottomScrollMessage();
        message.concatCommands(msg.getCommands());
    }

    function removeLastMessageTextCommand(): DrawCommand | null {
        return message.removeLastTextCommand();
    }

    function getLastMessageTextValue(): string | null {
        return message.getLastTextValue();
    }

    return (
        <Canvas 
            className="messageSketchContainer"
            message={message}
            findCharRepFromValue={findCharRepFromValue}
            sketchProperties={{
                canvasText: canvasText,
                api: api,
                canvasSketchRef: canvasSketchRef
            }}

        />
    )
}

export default MessageSketch;
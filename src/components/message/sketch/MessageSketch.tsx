import './MessageSketch.css';
import Canvas from "../canvas/Canvas";
import { useContext, useState } from 'react';
import { Message } from '@models/Message';
import type { Vector2 } from '@models/Vector2';
import type { DrawCommand } from '@models/DrawCommand';
import type { CanvasSketchPartialAPI } from '../canvas/CanvasAPI';
import { CanvasTypes } from '../canvas/CanvasAPI';
import { postMessage } from '@services/controllers/MessageController';
import { ThemeContext } from '@contexts/ThemeContext';
import type { CharRepresentation } from '@models/charrepresentations/CharRepresentation';
import type { CanvasSketchHandle } from '../canvas/sketch/CanvasSketch';
import type { FloatingKeyHandle } from '@components/floatingkey/FloatingKey';

const INIT_HEIGHT_PERCENT = 100;

type MessageSketchProps = {
    username: string;
    canvasText: string;
    getBottomScrollMessage: () => Message | null;
    findCharRepFromValue: (value: string) => CharRepresentation | undefined;
    addMessage: (message: Message) => void;
    canvasSketchRef: React.Ref<CanvasSketchHandle>;
    floatingKeyRef: React.RefObject<FloatingKeyHandle | null>;
} 

function MessageSketch(props: MessageSketchProps) {

    const api: CanvasSketchPartialAPI = {
        pushMessageCommand,
        sendMessage,
        concatBottomScrollMessage,
        resetMessage,
        removeLastMessageTextCommand,
        getLastMessageText
    };

    const theme = useContext(ThemeContext);

    const [message, setMessage] = useState(new Message([], props.username));

    function pushMessageCommand(type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) {
        message.pushCommand(type, startPos, endPos, value, penSize, penColor);
    }

    function resetMessage() {
        setMessage(new Message([], props.username));
    }

    function sendMessage() {
        props.addMessage(message);
        postMessage(message);
    }

    function concatBottomScrollMessage(): boolean {
        const msg = props.getBottomScrollMessage();
        if(!msg) return false;
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
            findCharRepFromValue={props.findCharRepFromValue}
            sketchProperties={{
                canvasText: props.canvasText,
                api: api,
                canvasSketchRef: props.canvasSketchRef,
                floatingKeyRef: props.floatingKeyRef
            }}

        />
    )
}

export default MessageSketch;
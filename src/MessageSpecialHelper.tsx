import { DrawingCommandType } from "./DrawCommand";
import { Message } from "./Message";
import { Vector2 } from "./Vector2";

function createMessage(creator: string, text: string): Message {
    const message = new Message([], creator, true);

    message.pushCommand(DrawingCommandType.TEXT, new Vector2(0.05, 0.1), new Vector2(0.0, 0.0), text, 1.0, "#000");


    return message;
}

export function createMessageWelcome(creator: string): Message {
    const text = "Welcome to Pictochat!";
    return createMessage(creator, text);
}

export function createMessageJoin(creator: string, room: string): Message {
    const text = `${creator} joined [${room}].`;
    return createMessage(creator, text);
}

export function createMessageLeave(creator: string, room: string): Message {
    const text = `${creator} left [${room}].`;
    return createMessage(creator, text);
}

export function createMessageBirthday(creator: string, room: string): Message {
    const text = `Happy Birthday, ${creator}!`;
    return createMessage(creator, text);
}

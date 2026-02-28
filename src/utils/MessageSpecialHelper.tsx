import { Message } from "@models/Message";

export function createSpecialMesssage(creator: string): Message {
    return new Message([], creator, true);
}

export function createMessageTextWelcome(): string {
    return "Welcome to Pict${PICTO_DPAD$}chat!";
}

export function createMessageTextJoin(creator: string, room: string): string {
    return `${creator} joined [${room}].`;
}

export function createMessageTextLeave(creator: string, room: string): string {
    return `${creator} left [${room}].`;
}

export function createMessageTextBirthday(creator: string, room: string): string {
    return `Happy Birthday, ${creator}!`;
}

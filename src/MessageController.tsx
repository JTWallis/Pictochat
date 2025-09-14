import type { Message } from "./Message";


export async function postMessage(message: Message) {
    console.log("POST", message);
    return;
}
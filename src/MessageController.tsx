import type { IMessage } from "@stomp/stompjs";
import { Message } from "./Message";
import { MessageDto } from "./MessageDto";
import { clientEstablished, stompClient } from "./StompClient";

const listenEndpoint = "/topic/room/a/messages";

function onReceivedMessage(message: IMessage, onReceivedMessageCallback: (msg: Message) => void) {
}

export function subscribeMessages(onReceivedMessageCallback: (msg: Message) => void) {
    if(!clientEstablished()) return;

    stompClient.subscribe(listenEndpoint, (message) => {
        onReceivedMessage(message, onReceivedMessageCallback);
    });
}

export async function postMessage(message: Message) {
    if(!clientEstablished()) return;

    const msgDto = new MessageDto(message.getCommands(), message.getUsername());

    stompClient.publish({
        destination: "/app/messages",
        body: JSON.stringify(msgDto)
    });

}
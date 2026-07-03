import type { IMessage } from "@stomp/stompjs";
import { Message } from "@models/Message";
import { MessageDto } from "../dtos/MessageDto";
import { clientEstablished, stompClient } from "../StompClient";
import { MessageFetchDto } from "../dtos/MessageFetchDto";

const listenEndpoint = "/topic/room/a/messages";

function onReceivedMessage(message: IMessage, onReceivedMessageCallback: (msg: MessageFetchDto) => void) {
    let receivedDto: MessageFetchDto;
    try {
        const rawDto = JSON.parse(message.body) as MessageFetchDto;
        receivedDto = MessageFetchDto.createFromRaw(rawDto);
    } catch(e) {
        console.error("Error when parsing JSON of MessageDto:", e);
        return;
    }

    onReceivedMessageCallback(receivedDto);
}

/**
 * Listens for new messages to fetch and triggers the callback with the message, when receiving one.
 * @param onReceivedMessageCallback Callback, receiving the fetched Message + creator-uuid
 */
export function subscribeMessages(onReceivedMessageCallback: (msg: MessageFetchDto) => void) {
    if(!clientEstablished()) return;

    stompClient.subscribe(listenEndpoint, (message) => {
        onReceivedMessage(message, onReceivedMessageCallback);
    });
}

/**
 * Sends a {@link Message} to the server, to which it will be distributed across the currently subscribed room.
 * @param message Fully constructed Message of {@link DrawCommand} and other metadata like the username (not uuid)
 */
export async function postMessage(message: Message) {
    if(!clientEstablished()) return;

    const msgDto = new MessageDto(message.getCommands(), message.getUsername());
    
    stompClient.publish({
        destination: "/app/messages",
        body: JSON.stringify(msgDto)
    });

}
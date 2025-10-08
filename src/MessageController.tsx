import { Message } from "./Message";
import { MessageDto } from "./MessageDto";
import { clientEstablished, stompClient } from "./StompClient";


export async function postMessage(message: Message) {
    if(!clientEstablished()) return;

    const msgDto = new MessageDto(message.getCommands(), message.getUsername());
    
    stompClient.publish({
        destination: "/app/messages",
        body: JSON.stringify(msgDto)
    });

}
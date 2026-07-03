import { Client } from '@stomp/stompjs';
import type { UserRegisterDto } from './dtos/UserRegisterDto';

const url = "ws://localhost:8100/pictochat"

export let stompClient: Client;

export function startClient(onConnectCallback: any) {
    console.log("Starting Client");
    stompClient = new Client({
        brokerURL: url,
        onConnect: () => {
            console.log("Connected!");
            onConnectCallback();
        }
    });

    stompClient.activate();
}

export function stopClient() {
    if(!stompClient) return;
    stompClient.deactivate();
}

export function registerUsername(username: string, registeredCallback: (userRegisterDto: UserRegisterDto) => void) {
    console.log("Publish Register");

    const receiptSubscribe = stompClient.subscribe("/user/queue/receipts", (e) => {
        const registerDto = JSON.parse(e.body) as UserRegisterDto;
        registeredCallback(registerDto);
        receiptSubscribe.unsubscribe();
    })

    stompClient.publish({
        destination: "/app/register",
        body: username
    });
}

export function subscribeQueueReply() {
    stompClient.subscribe("/user/queue/reply", (e) => {
        console.log("Got message at queue/reply!", e.body);
    })
}

export function clientEstablished(): boolean {
    return stompClient && stompClient.connected;
}
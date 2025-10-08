import { Client } from '@stomp/stompjs';

const url = "ws://localhost:8100/pictochat"

export let stompClient: Client;

export function startClient(onConnectCallback: any) {
    console.log("Starting Client");
    stompClient = new Client({
        brokerURL: url,
        onConnect: () => {
            console.log("Connected!");
            stompClient.subscribe("/user/queue/reply", (e) => {
                console.log("Got message at queue/reply!", e.body);
            })
            onConnectCallback();
        }
    });

    stompClient.activate();
}

export function clientEstablished(): boolean {
    return stompClient && stompClient.connected;
}
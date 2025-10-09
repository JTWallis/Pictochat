import { Client } from '@stomp/stompjs';

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

export function registerUsername(username: string, registeredCallback: any) {
    console.log("Publish Register");

    const receiptSubscribe = stompClient.subscribe("/user/queue/receipts", (e) => {
        registeredCallback();
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

export function subscribeTotalConnections(totalConnectionCallback: any) {
    stompClient.subscribe("/topic/connections", (e) => {
        console.log("New room subscription!", e.body);
        totalConnectionCallback(e);
    });
}

export function subscribeRoomConnections() {
    console.log("Subscribing RoomConnections");
    stompClient.subscribe("/topic/room/a/connections", (e) => {
        console.log("Connection/Disconnection in Room a:", e.body);
    })
}

export function clientEstablished(): boolean {
    return stompClient && stompClient.connected;
}
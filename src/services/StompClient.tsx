import { Client } from '@stomp/stompjs';
import type { UserRegisterDto } from './dtos/UserRegisterDto';

const url = "ws://localhost:8100/pictochat"

export let stompClient: Client;

/**
 * Starts the Stomp client and attempts to establish a server connection.
 * @param onConnectCallback Callback, triggered when a successful connection is established.
 */
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

/**
 * Stops the Stomp client and in turn terminates an ongoing server connection.
 */
export function stopClient() {
    if(!stompClient) return;
    stompClient.deactivate();
}

/**
 * Registers the username to the server, to receive the own uuid.
 * Triggers the callback, when receiving a reply about the associated uuid.
 * @param username Username/Nickname to display in messages. Different connected users can share the same nickname.
 * @param registeredCallback Callback, receiving the own uuid to differentiate message-creators (even with same nicknames).
 */
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

/**
 * Subscribe to receive signals from the server to only oneself.
 * Currently unused, but left anyway in case this feature gets relevant in the future.
 */
export function subscribeQueueReply() {
    stompClient.subscribe("/user/queue/reply", (e) => {
        console.log("Got message at queue/reply!", e.body);
    })
}

/**
 * @returns true, if the Stomp client is initialized and successfully connected to the server.
 */
export function clientEstablished(): boolean {
    return stompClient && stompClient.connected;
}
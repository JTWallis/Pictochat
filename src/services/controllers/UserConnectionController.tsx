import type { IMessage } from "@stomp/stompjs";
import type { RoomsDto } from "../dtos/RoomsDto";
import type { RoomDto } from "../dtos/RoomDto";
import { stompClient } from "../StompClient";
import type { UserConnectionDto } from "../dtos/UserConnectionDto";
import { createMessageTextJoin, createMessageTextLeave } from "@utils/MessageSpecialHelper";

type totalConnectCallbackType = (counts: number[]) => void;
type roomConnectCallbackType = (connectMessageText: string, creatorUuid: string) => void;

const UserConnectionTypes = {
    CONNECT: "CONNECT",
    DISCONNECT: "DISCONNECT"
}

/**
 * Triggers the callback, whenever a new user has joined any room.
 * Useful for displaying different chatroom user-counts in one page.
 * @param onReceivedTotalConnectionsCallback Callback, receiving an array of user-counts per room
 */
export function subscribeTotalConnections(onReceivedTotalConnectionsCallback: (counts: number[]) => void) {
    stompClient.subscribe("/topic/connections", (e: IMessage) => {
        console.log("New room subscription!", e.body);
        onReceivedTotalConnections(e, onReceivedTotalConnectionsCallback);
    });
}

/**
 * Joins a room and triggers the callback, when a new user has joined/left this room.
 * @param room The supported room to join. Should be a single character.
 * @param onReceivedRoomConnectionCallback Callback, receiving a connect/disconnect message with the message-creator's uuid
 */
export function subscribeRoomConnections(room: string, onReceivedRoomConnectionCallback: roomConnectCallbackType) {
    console.log("Subscribing RoomConnections");
    stompClient.subscribe("/topic/room/a/connections", (e: IMessage) => {
        console.log("Connection/Disconnection in Room a:", e.body);
        onReceivedRoomConnection(e, room, onReceivedRoomConnectionCallback);
    })
}

function onReceivedTotalConnections(message: IMessage, onReceivedTotalConnectionsCallback: totalConnectCallbackType) {
    const json = JSON.parse(message.body) as RoomsDto;
    const counts: number[] = [];
    json.rooms.forEach((room: RoomDto) => {
        counts.push(room.connectionCount);
    })

    onReceivedTotalConnectionsCallback(counts);
}

function onReceivedRoomConnection(message: IMessage, room: string, onReceivedRoomConnectionCallback: roomConnectCallbackType) {
    const userConnection = JSON.parse(message.body) as UserConnectionDto;
    const uuid = userConnection.uuid;
    const creator = userConnection.nickname;
    let messageText;

    switch(userConnection.connectionType) {
        case UserConnectionTypes.CONNECT:
            messageText = createMessageTextJoin(creator, room);
            break;
        case UserConnectionTypes.DISCONNECT:
            messageText = createMessageTextLeave(creator, room);
            break;
        default:
            messageText = "";
            break;
    }

    onReceivedRoomConnectionCallback(messageText, uuid);
}
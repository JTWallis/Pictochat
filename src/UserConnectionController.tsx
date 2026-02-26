import type { IMessage } from "@stomp/stompjs";
import type { RoomsDto } from "./RoomsDto";
import type { RoomDto } from "./RoomDto";
import { stompClient } from "./StompClient";
import type { UserConnectionDto } from "./UserConnectionDto";
import { createMessageTextJoin, createMessageTextLeave } from "./MessageSpecialHelper";

type totalConnectCallbackType = (counts: number[]) => void;
type roomConnectCallbackType = (connectMessageText: string, creatorUuid: string) => void;

const UserConnectionTypes = {
    CONNECT: "CONNECT",
    DISCONNECT: "DISCONNECT"
}

export function subscribeTotalConnections(onReceivedTotalConnectionsCallback: (counts: number[]) => void) {
    stompClient.subscribe("/topic/connections", (e: IMessage) => {
        console.log("New room subscription!", e.body);
        onReceivedTotalConnections(e, onReceivedTotalConnectionsCallback);
    });
}

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
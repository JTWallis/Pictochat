import type { IMessage } from "@stomp/stompjs";
import type { RoomsDto } from "./RoomsDto";
import type { RoomDto } from "./RoomDto";
import { stompClient } from "./StompClient";

type totalConnectCallbackType = (counts: number[]) => void;

export function subscribeTotalConnections(onReceivedTotalConnectionsCallback: (counts: number[]) => void) {
    stompClient.subscribe("/topic/connections", (e: IMessage) => {
        console.log("New room subscription!", e.body);
        onReceivedTotalConnections(e, onReceivedTotalConnectionsCallback);
    });
}

function onReceivedTotalConnections(message: IMessage, onReceivedTotalConnectionsCallback: totalConnectCallbackType) {
    const json = JSON.parse(message.body) as RoomsDto;
    const counts: number[] = [];
    json.rooms.forEach((room: RoomDto) => {
        counts.push(room.connectionCount);
    })

    onReceivedTotalConnectionsCallback(counts);
}
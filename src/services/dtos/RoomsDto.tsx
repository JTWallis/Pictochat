import type { RoomDto } from "./RoomDto";

/**
 * Received Dto from the server, that tells how many
 * users are currently connected in each supported room.
 */
export type RoomsDto = {
    rooms: RoomDto[];
}
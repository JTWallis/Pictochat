/**
 * Received Dto from the server within an array,
 * that tells how many users are currently connected in a specific room.
 */
export type RoomDto = {
    roomNumber: string,
    connectionCount: number
};
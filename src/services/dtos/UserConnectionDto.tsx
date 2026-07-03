/**
 * Received Dto from the server, signalling that a user has
 * connected or disconnected from the currently subscribed room.
 * The uuid is used to ignore a redundant connect-/disconnect-message,
 * for the own user, since this message is already reconstructed locally before sending.
 */
export type UserConnectionDto = {
    uuid: string,
    nickname: string,
    connectionType: string      // "CONNECT" or "DISCONNECT"
}
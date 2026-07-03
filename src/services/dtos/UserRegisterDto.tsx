/**
 * Received Dto from the server, that tells the own server-uuid,
 * along a possible status message.
 * The uuid is used to ignore redundant message-reconstructions,
 * if the fetched message's creator-uuid matches with the own uuid.
 */
export type UserRegisterDto = {
    uuid: string,
    status: string
}
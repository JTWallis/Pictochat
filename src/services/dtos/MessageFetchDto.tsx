import { MessageDto } from "./MessageDto";
import { Message } from "@models/Message";

/**
 * Variant of a {@link Message} with stripped metadata,
 * leaving only the list of {@link DrawCommand} and username,
 * plus a server-side uuid of the message-creator,
 * to skip a redundant message-reconstruction if the creator-uuid matches with the local uuid.
 * This Dto is received from the server.
 */
export class MessageFetchDto extends MessageDto {
    public creatorUuid: string;

    constructor(message: MessageDto, creatorUuid: string) {
        super(message.commands, message.creatorName);
        this.creatorUuid = creatorUuid;
    }

    public toMessage(): Message {
        return new Message(this.commands, this.creatorName);
    }

    public static override createFromRaw(obj: any): MessageFetchDto {
        return new MessageFetchDto(
            super.createFromRaw(obj),
            obj.creatorUuid
        );
    }
}
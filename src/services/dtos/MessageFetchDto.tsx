import { MessageDto } from "./MessageDto";
import { Message } from "@models/Message";

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
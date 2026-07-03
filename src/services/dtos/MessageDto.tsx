import { DrawCommand } from "@models/DrawCommand";

/**
 * Variant of a {@link Message} with stripped metadata,
 * leaving only the list of {@link DrawCommand} and username,
 * to send to the server.
 */
export class MessageDto {
    public commands: DrawCommand[];
    public creatorName: string;

    constructor(commands: DrawCommand[], creatorName: string) {
        this.commands = commands;
        this.creatorName = creatorName;
    }

    public static createFromRaw(obj: any): MessageDto {
        return new MessageDto(
            obj.commands.map((e: any) => DrawCommand.createFromRaw(e)),
            obj.creatorName
        );
    }
}
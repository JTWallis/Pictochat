import { DrawCommand } from "./DrawCommand";

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
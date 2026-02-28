import { DrawingCommandType, DrawCommand } from "./DrawCommand";
import type { Vector2 } from "../Vector2";

export class Message {

    public commands: DrawCommand[];
    private creatorName: string;
    private isSpecial: boolean;
    private lastTextCommandIndex: number = -1;

    constructor(commands: DrawCommand[], creatorName: string, isSpecial?: boolean) {
        this.commands = commands;
        this.creatorName = creatorName;
        this.isSpecial = isSpecial ? isSpecial : false;
    }
    
    private pushDrawCommand(command: DrawCommand): void {
        this.commands.push(command);

        if(command.getType() !== DrawingCommandType.LINE_STROKE) {
            this.lastTextCommandIndex = this.commands.length - 1;
        }
    }
    

    public pushCommand(type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string): void {
        this.pushDrawCommand(new DrawCommand(this.commands.length, type, startPos, endPos, value, penSize, penColor));
    }

    public concatCommands(commands: DrawCommand[]) {
        this.commands = this.commands.concat(commands);
        this.updateLastTextCommandIndex();
    }

    public getLastText(): DrawCommand | null {
        if(this.lastTextCommandIndex < 0) return null;
        if(this.commands.length === 0) return null;
        return this.commands.at(this.lastTextCommandIndex)!;
    }

    public removeLastTextCommand(): DrawCommand | null {
        if(this.lastTextCommandIndex < 0) return null;
        if(this.commands.length === 0) return null;

        const msg = this.commands.at(this.lastTextCommandIndex)!;
        this.commands.splice(this.lastTextCommandIndex, 1);

        this.updateLastTextCommandIndex();

        return msg;
    }

    public getCommands(): DrawCommand[] {
        return this.commands;
    }

    public getUsername(): string {
        return this.creatorName;
    }

    public isSpecialMessage(): boolean {
        return this.isSpecial;
    }

    private updateLastTextCommandIndex() {
        for(let i = this.commands.length - 1; i >= 0; i--) {
            if(this.commands[i].getType() !== DrawingCommandType.LINE_STROKE) {
                this.lastTextCommandIndex = i;
                return;
            }
        }

        this.resetLastTextCommandIndex();
    }

    private resetLastTextCommandIndex(): void {
        this.lastTextCommandIndex = -1;
    }


}
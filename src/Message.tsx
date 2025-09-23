import { DrawingCommandType, DrawCommand } from "./DrawCommand";
import type { Vector2 } from "./Vector2";

export class Message {

    public commands: DrawCommand[];
    private creatorName: string;
    private lastTextCommandIndex: number = -1;

    constructor(commands: DrawCommand[], creatorName: string) {
        this.commands = commands;
        this.creatorName = creatorName;
    }
    
    private pushDrawCommand(command: DrawCommand): void {
        this.commands.push(command);

        if(command.getType() === DrawingCommandType.TEXT) {
            this.lastTextCommandIndex = this.commands.length - 1;
        }
    }
    

    public pushCommand(type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string): void {
        this.pushDrawCommand(new DrawCommand(this.commands.length, type, startPos, endPos, value, penSize, penColor));
    }

    public removeLastTextCommand(): void {
        if(this.lastTextCommandIndex < 0) return;

        this.commands.splice(this.lastTextCommandIndex, 1);

        // Update lastCommandIndex
        for(let i = this.commands.length - 1; i >= 0; i--) {
            if(this.commands[i].getType() === DrawingCommandType.TEXT) {
                this.lastTextCommandIndex = i;
                break;
            }
        }
    }

    public getCommands(): DrawCommand[] {
        return this.commands;
    }

    public getUsername(): string {
        return this.creatorName;
    }

    private updateLastTextCommandIndex() {
        for(let i = this.commands.length - 1; i >= 0; i--) {
            if(this.commands[i].getType() === DrawingCommandType.TEXT) {
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
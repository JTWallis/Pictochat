import { Vector2 } from "../Vector2";

export const DrawingCommandType = {
    LINE_STROKE: 0,
    TEXT: 1,
    FLOATING_KEY: 2
}


export class DrawCommand {
    private id: number;
    private type: number;
    private startPos: Vector2;
    private endPos: Vector2;
    private value: string;
    private penSize: number;
    private penColor: string;

    constructor(id: number, type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) {
        this.id = id;
        this.type = type;
        this.startPos = startPos;
        this.endPos = endPos;
        this.value = value;
        this.penSize = penSize;
        this.penColor = penColor;
    }

    public getId(): number {
        return this.id;
    }

    public getType(): number {
        return this.type;
    }

    public getStartPos(): Vector2 {
        return this.startPos;
    }

    public getEndPos(): Vector2 {
        return this.endPos;
    }

    public getValue(): string {
        return this.value;
    }

    public getPenSize(): number {
        return this.penSize
    }

    public getPenColor(): string {
        return this.penColor;
    }
 
    public debugPrintString(): string {
        return `ID[${this.id}]; TYPE[${this.type}]; START[${this.startPos.x} | ${this.startPos.y}]; END[${this.endPos.x} | ${this.endPos.y}]; VALUE[${this.value}]; SIZE[${this.penSize}]; COLOR[${this.penColor}]`;
    }

    public static createFromRaw(obj: any) : DrawCommand {
        return new DrawCommand(obj.id,
            obj.type,
            Vector2.createFromRaw(obj.startPos),
            Vector2.createFromRaw(obj.endPos),
            obj.value,
            obj.penSize,
            obj.penColor
        );
    }

}
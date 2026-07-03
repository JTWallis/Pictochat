import { Vector2 } from "./Vector2";

export const DrawingCommandType = {
    LINE_STROKE: 0,
    FLOATING_KEY: 1
}

/**
 * A DrawCommand represents a single, reconstructable drawing-part.
 * This can be either of type "line-stroke", or a "floating-key" (char-sprite).
 * The DrawCommand has a normalized start- and end-xy-pos, mostly useful for a line-stroke.
 * Floating-keys instead only use the start-pos, along a value that dictates their sprite.
 * The pen-size is only relevant for the thickness of a line-stroke.
 * Lastly, the pen-color is a hex-string, depicting the color of the drawn line-stroke or floating-key.
 * 
 * A list of many DrawCommands make up a {@link Message}, which can be sent around a network
 * and reconstructed onto a {@link Canvas}, by parsing and unnormalizing the values.
 */
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
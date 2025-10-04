import type { DrawCommand } from "./DrawCommand";
import type { Vector2 } from "./Vector2";

export interface CanvasSketchPartialAPI {
    pushMessageCommand: (type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) => void;
    sendMessage: () => void;
    concatBottomScrollMessage: () => void;
    removeLastMessageTextCommand: () => DrawCommand | null ;
    getLastMessageTextValue: () => string | null;
}

export interface CanvasSketchFullAPI extends CanvasSketchPartialAPI  {
    drawStroke: (posSrc: Vector2, posDst: Vector2, drawDot: boolean, size: number, color: string) => void;
    drawText: (pos: Vector2, value: string) => void;
    drawImage: (img: HTMLImageElement, pos: Vector2, colorFill: string) => void;
    reconstructMessage: () => void;
    clearCanvas: () => void;
}
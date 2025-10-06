import type { DrawCommand } from "./DrawCommand";
import type { Vector2 } from "./Vector2";

export interface CanvasSketchPartialAPI {
    pushMessageCommand: (type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) => void;
    sendMessage: () => void;
    concatBottomScrollMessage: () => void;
    removeLastMessageTextCommand: () => DrawCommand | null ;
    getLastMessageText: () => DrawCommand | null;
}

export interface CanvasSketchFullAPI extends CanvasSketchPartialAPI  {
    drawPushStroke: (posSrc: Vector2, posDst: Vector2, penSize: number, penColor: string) => void;
    drawPushText: (pos: Vector2, value: string) => void;
    drawPushImage: (img: HTMLImageElement, pos: Vector2, colorFill: string) => void;
    createAppendFloatingKeyImage: (src: string, value: string, colorFill: string) => void;
    reconstructMessage: () => void;
    clearCanvas: () => void;
    setCanvasTextPos: (pos: Vector2) => void;
    incrementCanvasTextPosX: (incrementFrom?: Vector2) => void;
}
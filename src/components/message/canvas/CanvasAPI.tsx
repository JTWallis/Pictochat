import type { CharRepresentation } from "@models/charrepresentations/CharRepresentation";
import type { DrawCommand } from "@models/DrawCommand";
import type { Vector2 } from "@models/Vector2";

export const CanvasTypes = {
    CANVAS_SKETCH: 0,
    CANVAS_DISPLAY: 1,
    CANVAS_SPECIAL: 2
};

export interface CanvasSketchPartialAPI {
    pushMessageCommand: (type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) => void;
    sendMessage: () => void;
    concatBottomScrollMessage: () => boolean;
    resetMessage: () => void;
    removeLastMessageTextCommand: () => DrawCommand | null ;
    getLastMessageText: () => DrawCommand | null;
}

export interface CanvasSketchFullAPI extends CanvasSketchPartialAPI  {
    drawPushStroke: (posSrc: Vector2, posDst: Vector2, penSize: number, penColor: string) => void;
    drawPushImage: (img: HTMLImageElement, pos: Vector2, colorFill: string) => void;
    pushWhitespace: () => void;
    pushNewline: () => void;
    createAppendFloatingKeyImage: (src: string, value: string, colorFill: string) => Promise<void>;
    reconstructMessage: () => void;
    clearCanvas: () => void;
    setCanvasTextPos: (pos: Vector2) => void;
    incrementCanvasTextPosX: (incrementFrom?: Vector2) => void;
}

export interface CanvasDisplayAPI {
    setStripeSteps: (steps: number) => void;
    setRenderStripes: (renderStripes: boolean) => void;
    setDrawOffsetY: (offsetY: number) => void;
    getStripeRects: () => DOMRect[];
    getNameRect: () => DOMRect | null;
    getMessageCommands: () => DrawCommand[];
}

export interface CanvasSpecialPartialAPI {
    pushMessageCommand: (type: number, startPos: Vector2, endPos: Vector2, value: string, penSize: number, penColor: string) => void;
    convertTextToCharReps: (text: string) => CharRepresentation[];
}

export interface CanvasSpecialFullAPI extends CanvasSpecialPartialAPI {
    setStripeSteps: (steps: number) => void;
    setRenderStripes: (renderStripes: boolean) => void;
    setCanvasTextPos: (pos: Vector2) => void;
    createAppendFloatingKeyImage: (src: string, value: string, colorFill: string) => Promise<void>;
    reconstructMessage: () => void;
}
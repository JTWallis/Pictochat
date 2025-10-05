import type { DrawCommand } from "./DrawCommand";

export interface CanvasDisplayAPI {
    setStripeSteps: (steps: number) => void;
    setRenderStripes: (renderStripes: boolean) => void;
    setDrawOffsetY: (offsetY: number) => void;
    getStripeRects: () => DOMRect[];
    getNameRect: () => DOMRect | null;
    getMessageCommands: () => DrawCommand[];
}
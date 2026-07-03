import type { CharRepresentation } from "@models/charrepresentations/CharRepresentation";
import { Vector2 } from "@models/Vector2";

/**
 * Base class for a Charmap, which represents a set of many {@link CharRepresentation},
 * providing a specific alphabet for the {@link VirtualKeyboard}.
 */
export abstract class CharmapBase {
    protected rowRangeIndices: Vector2[] = [];

    public init() {
        this.initRepresentations();
        this.initRowRanges();
    }
    
    public getRowRangeIndices() {
        return this.rowRangeIndices;
    }

    public abstract findRepresentation(value: string): CharRepresentation | undefined;
    protected abstract initRepresentations(): void;
    protected abstract initRowRanges(): void;
    protected abstract createRowRangeFromValues(startValue: string, endValue: string): Vector2;
}
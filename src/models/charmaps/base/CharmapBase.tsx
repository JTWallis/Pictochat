import type { CharRepresentation } from "../../../CharRepresentation";
import { Vector2 } from "../../../Vector2";

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
import { CharmapBase } from "./CharmapBase";
import type { CharRepresentation } from "@models/charrepresentations/CharRepresentation";
import { Vector2 } from "@models/Vector2";

/**
 * Subclass of a {@link CharmapBase}, changing the interpretation of a Charmap,
 * to single-value chars, that are not tied with another.
 * See {@link CharmapBaseDouble} for further explanation on what this means.
 */
export abstract class CharmapBaseSingle extends CharmapBase {
    protected representations: CharRepresentation[] = [];
    protected ignoreGridCellIndices: Vector2[] = [];    // Explicit empty grid cells with indices starting from 1.
    protected specialGridCellIndices: number[] = [];

    constructor() {
        super();
        this.init();
        this.initIgnoreGridCellIndices();
        this.initSpecialGridCellIndices();
    }

    public getCharRepresentations(): CharRepresentation[] {
        return this.representations;
    }

    public getIgnoreGridCellIndices(): Vector2[] {
        return this.ignoreGridCellIndices;
    }

    public isGridCellSpecial(index: number): boolean {
        return this.specialGridCellIndices.includes(index);
    }

    protected abstract initIgnoreGridCellIndices(): void;
    protected abstract initSpecialGridCellIndices(): void;

    public findRepresentation(value: string): CharRepresentation | undefined {
        return this.representations.find(e => e.value === value);
    }

    protected createRowRangeFromValues(startValue: string, endValue: string): Vector2 {
        return new Vector2(
            this.representations.findIndex((e) => e.value === startValue),
            this.representations.findIndex((e) => e.value === endValue)
        );
    }



}
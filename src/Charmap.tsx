import type { CharRepresentation } from "./CharRepresentation";
import { Vector2 } from "./Vector2";

export abstract class Charmap {
    protected representations: CharRepresentation[];
    protected rowRangeIndices: Vector2[];

    constructor() {
        this.representations = this.createRepresentations();
        this.rowRangeIndices = this.createRowRanges();
    }

    public getCharRepresentations(): CharRepresentation[] {
        return this.representations;
    }
    
    public getRowRangeIndices() {
        return this.rowRangeIndices;
    }

    protected abstract createRepresentations(): CharRepresentation[];
    protected abstract createRowRanges(): Vector2[];

    protected createRowRangeFromValues(startValueLower: string, endValueLower: string): Vector2 {
        return new Vector2(
            this.representations.findIndex((e) => e.valueLower === startValueLower),
            this.representations.findIndex((e) => e.valueLower === endValueLower)
        );
    }
}
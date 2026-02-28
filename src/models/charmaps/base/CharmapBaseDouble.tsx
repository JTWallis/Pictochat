import { CharmapBase } from "./CharmapBase";
import type { CharRepresentation } from "@models/charrepresentations/CharRepresentation";
import type { CharRepresentationLowerUpper } from "@models/charrepresentations/CharRepresentationLowerUpper";
import { Vector2 } from "@models/Vector2";

export abstract class CharmapBaseDouble extends CharmapBase {
    protected representations: CharRepresentationLowerUpper[] = [];
    protected shiftIncludedIndices: number[] = [];

    constructor() {
        super();
        this.init();
    }

    public override init() {
        super.init();
        this.initShiftIncludedIndices();
    }

    public getCharRepresentations(): CharRepresentationLowerUpper[] {
        return this.representations;
    }

    public isCharShiftIncluded(char: string): boolean {
        for(var index of this.shiftIncludedIndices) {
            const rep = this.representations[index];
            if(rep.lower.value === char || rep.upper.value === char) {
                return true;
            }
        }

        return false;
    }

    public findRepresentation(value: string): CharRepresentation | undefined {
        let result: CharRepresentation | undefined;
        this.representations.every(e => {
            if (e.lower.value === value) result = e.lower;
            else if (e.upper.value === value) result = e.upper;
            return (result === undefined);
        });

        return result;
    }

    protected abstract initShiftIncludedIndices(): void;

    protected createRowRangeFromValues(startValueLower: string, endValueLower: string): Vector2 {
        return new Vector2(
            this.representations.findIndex((e) => e.lower.value === startValueLower),
            this.representations.findIndex((e) => e.lower.value === endValueLower)
        );
    }

}
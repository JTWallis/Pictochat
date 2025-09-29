import { CharmapBase } from "./CharmapBase";
import type { CharRepresentation } from "./CharRepresentation";
import type { CharRepresentationLowerUpper } from "./CharRepresentationLowerUpper";
import { Vector2 } from "./Vector2";

export abstract class CharmapBaseDouble extends CharmapBase {
    protected representations: CharRepresentationLowerUpper[] = [];

    constructor() {
        super();
        this.init();
    }

    public getCharRepresentations(): CharRepresentationLowerUpper[] {
        return this.representations;
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

    protected createRowRangeFromValues(startValueLower: string, endValueLower: string): Vector2 {
        return new Vector2(
            this.representations.findIndex((e) => e.lower.value === startValueLower),
            this.representations.findIndex((e) => e.lower.value === endValueLower)
        );
    }

}
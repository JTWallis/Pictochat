import { CharmapBaseSingle } from "./CharmapBaseSingle";
import type { CharRepresentation } from "@models/charrepresentations/CharRepresentation";

/**
 * Subclass of a {@link CharmapBaseSingle}, that extends the class with behaviour
 * unique to japanese characters (e.g. transforming chars between Hiragana and Kana,
 * adding a Dakuten/Handakuten, or transforming certain chars into smaller variants).
 */
export abstract class CharmapBaseJapanese extends CharmapBaseSingle {
    protected representationsDakuten: Map<number, CharRepresentation> = new Map();
    protected representationsHandakuten: Map<number, CharRepresentation> = new Map();
    protected representationsSmall: Map<number, CharRepresentation> = new Map();

    constructor() {
        super();
        this.initRepresentationsDakuten();
        this.initRepresentationsHandakuten();
        this.initRepresentationsSmall();      
    }

    protected abstract initRepresentationsDakuten(): void;
    protected abstract initRepresentationsHandakuten(): void;
    protected abstract initRepresentationsSmall(): void;

    public override findRepresentation(value: string): CharRepresentation | undefined {
        let representation;

        representation = this.representations.find(e => e.value === value);
        if(!representation) representation = [...this.representationsDakuten.values()].find(e => e.value === value);
        if(!representation) representation = [...this.representationsHandakuten.values()].find(e => e.value === value);
        if(!representation) representation = [...this.representationsSmall.values()].find(e => e.value === value);

        return representation;
    }

    public getTransformedRepresentation(value: string, transformType: string): CharRepresentation | undefined {
        switch(transformType) {
            case "゛":
                return this.getTransformedDakuten(value);
            case "゜":
                return this.getTransformHandakuten(value);
            case "SMALL":
                return this.getTransformedSmall(value);
            default:
                return undefined;
        }
    }

    private getTransformedDakuten(value: string): CharRepresentation | undefined {
        // Return normal representation if value is already Dakuten.
        for(const [key, valueDakuten] of this.representationsDakuten) {
            if(valueDakuten.value === value) return this.representations.at(key);
        }

        // Transform Handakuten into Dakuten.
        let index;
        for(const [key, valueHandakuten] of this.representationsHandakuten) {
            if(valueHandakuten.value === value) {
                index = key;
                break;
            }
        }

        if(!index) index = this.representations.findIndex(e => e.value === value)
        return this.representationsDakuten.get(index);
    }

    private getTransformHandakuten(value: string): CharRepresentation | undefined {
        // Return normal representation if value is already Handakuten.
        for(const [key, valueHandakuten] of this.representationsHandakuten) {
            if(valueHandakuten.value === value) return this.representations.at(key);
        }

        // Transform Dakuten into Handakuten.
        let index;
        for(const [key, valueDakuten] of this.representationsDakuten) {
            if(valueDakuten.value === value) {
                index = key;
                break;
            }
        }

        if(!index) index =  this.representations.findIndex(e => e.value === value)
        return this.representationsHandakuten.get(index);
    }

    private getTransformedSmall(value: string): CharRepresentation | undefined {
        // Return normal presentation if value is already small.
        for(const [key, valueSmall] of this.representationsSmall) {
            if(valueSmall.value === value) return this.representations.at(key);
        }

        const index = this.representations.findIndex(e => e.value === value)
        return this.representationsSmall.get(index);
    }
}
import type { CharmapBase } from "@models/charmaps/base/CharmapBase";
import { CharmapBaseDouble } from "@models/charmaps/base/CharmapBaseDouble";
import { CharmapBaseSingle } from "@models/charmaps/base/CharmapBaseSingle";
import type { CharRepresentation } from "@models/charrepresentations/CharRepresentation";

function countNonEmptySlots(arr: any[]): number {
    return arr.filter(e => e).length;
}

function mergeArrIntoEmptySlots(src: any[], merge: any[]): any[] {
    for (let i = 0; i < merge.length; i++) {
        if (!merge[i]) continue;
        if (!src[i]) src[i] = merge[i];
    }
    return src;
}

function searchCharReps(reps: CharRepresentation[], values: string[], handledValues: number) {
    const foundCharReps: CharRepresentation[] = Array(values.length);

    for (let charrep of reps) {
        values.forEach((value, index) => {
            if (value === charrep.value) {
                foundCharReps[index] = charrep;
                handledValues++;
            }
        });
        if (handledValues >= foundCharReps.length) break;
    };

    return foundCharReps;
}

function findCharRepsFromTextValues(charmaps: CharmapBase[], values: string[]) {
    let handledValues = 0;
    let charReps: CharRepresentation[] = Array(values.length);

    for (let charmap of charmaps) {
        if (charmap instanceof CharmapBaseSingle) {
            const reps = (charmap as CharmapBaseSingle).getCharRepresentations();
            const foundCharReps = searchCharReps(reps, values, handledValues);
            charReps = mergeArrIntoEmptySlots(charReps, foundCharReps);
            handledValues = countNonEmptySlots(charReps);

        } else if (charmap instanceof CharmapBaseDouble) {
            const reps = (charmap as CharmapBaseDouble).getCharRepresentations();
            const upperReps = reps.map(e => e.upper);
            let foundCharReps = searchCharReps(upperReps, values, handledValues);
            charReps = mergeArrIntoEmptySlots(charReps, foundCharReps);
            handledValues = countNonEmptySlots(charReps);
            if (handledValues >= charReps.length) break;

            const lowerReps = reps.map(e => e.lower);
            foundCharReps = searchCharReps(lowerReps, values, handledValues);
            charReps = mergeArrIntoEmptySlots(charReps, foundCharReps);
            handledValues = countNonEmptySlots(charReps);
        }

        if (handledValues >= charReps.length) break;
    };

    return charReps;
}

/**
 * Takes a text-string and converts each char-value into a {@link CharRepresentation}.
 * Some special char-values have a length bigger than 1 and must be escaped with the syntax '${text$}'.
 * @param charmaps All Charmaps to lookup the char-value from.
 * @param text Convertable string with supported (escaped) char-values. E.g. 'Pict${PICTO_DPAD$}chat'
 * @returns Array of converted CharRepresentations.
 */
export function convertTextToCharRepresentations(charmaps: CharmapBase[], text: string): CharRepresentation[] {
    const values: string[] = [];

    const escapeChar = "$";
    const escapeOpen = "{";
    const escapeClose = "}";
    let escapeCharText = "";
    let isEscape = false;

    // Convert text-string with escape chars into array of values, each representing a CharRep value to look up.
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (i + 1 < text.length) {
            const currAndNext = text.substring(i, i + 2);
            if (!isEscape && currAndNext === (escapeChar + escapeOpen)) {
                isEscape = true;
                i++;
                continue;
            }

            if (isEscape && currAndNext === (escapeChar + escapeClose)) {
                values.push(escapeCharText);
                escapeCharText = "";
                isEscape = false;
                i++;
                continue;
            }
        }

        if (isEscape) escapeCharText += char;
        else if(char === " ") values.push("SPACE");
        else values.push(char);
    }

    return findCharRepsFromTextValues(charmaps, values);
}

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

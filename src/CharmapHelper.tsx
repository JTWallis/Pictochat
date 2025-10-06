
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

const rainbowPhaseR = 0;
const rainbowPhaseG = 2;
const rainbowPhaseB = 4;
const freq = 0.31415;
const maxTicks = 32;

/**
 * Takes a single value between 0 and 255 and turns it into a 2-digit hex representation.
 * @param b Color value between 0 and 255.
 * @returns 2-digit hex-representation of that value.
 */
function byteToHex(b: number): string {
    const str = "0123456789ABCDEF";
    const subStrFirst = (b >> 4) & 0x0F;
    const subStrSecond = b & 0x0F;
    return str.substring(subStrFirst, subStrFirst + 1) + str.substring(subStrSecond, subStrSecond + 1);
}

/**
 * Takes three RGB values between 0 and 255 and turns them in a 6-digit hex-representation, including hash-char.
 * @param r Red color value.
 * @param g Green color value.
 * @param b Blue color value.
 * @returns 6-digit hex-representation of the RGB values, with '#' as the prefix. E.g. #12ABCD
 */
function rgbToColor(r: number, g: number, b: number): string {
    return "#" + byteToHex(r) + byteToHex(g) + byteToHex(b);
}

/**
 * Increments the passed tick, resetting to 0 when reaching the maxTicks of 32.
 * @param tick Current tick between 0 and 31.
 * @returns Incremented tick between 0 and 31.
 */
export function incrementTickRainbow(tick: number) {
    return ++tick % maxTicks;
}

/**
 * Gets a hex-representation of the color, corresponding to the current tick.
 * @param tick Current tick between 0 and 31.
 * @returns 6-digit hex-representation of the RGB values, with '#' as the prefix. E.g. #12ABCD
 */
export function getTickRainbowHex(tick: number): string {
    const r = Math.sin(freq * tick + rainbowPhaseR) * 127 + 128;
    const g = Math.sin(freq * tick + rainbowPhaseG) * 127 + 128;
    const b = Math.sin(freq * tick + rainbowPhaseB) * 127 + 128;

    return rgbToColor(r, g, b);
}
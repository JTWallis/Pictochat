import type { CharRepresentation } from "./CharRepresentation"

/**
 * Represents two pairs of char-encoding and sprite:
 * One pair for a lowercase variant and one for an uppercase variant.
 */
export type CharRepresentationLowerUpper = {
    lower: CharRepresentation,
    upper: CharRepresentation
}

export class Vector2 {
    public x: number;
    public y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public equals(other: Vector2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    public static createFromRaw(obj: any): Vector2 {
        return new Vector2(obj.x, obj.y);
    }
}
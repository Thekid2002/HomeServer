import { ValObject } from "./ValObject";

export class ValDouble extends ValObject {
    public value: f64;

    constructor(value: f64) {
        super();
        this.value = value;
    }

    public toString(): string {
        return this.value.toString();
    }

    public toJsonString(): string {
        return this.value.toString();
    }
}

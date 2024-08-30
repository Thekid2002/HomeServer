import { ValObject } from "./ValObject";

export class ValInt extends ValObject {
    public value: i32;

    constructor(value: i32) {
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

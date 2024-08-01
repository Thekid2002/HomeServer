import {ValObject} from "./ValObject";

export class ValNum extends ValObject {
    public value: number;

    constructor(value: number) {
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

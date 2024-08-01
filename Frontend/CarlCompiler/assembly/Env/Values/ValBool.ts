import {ValObject} from "./ValObject";

export class ValBool extends ValObject {
    public value: boolean;

    constructor(value: boolean) {
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

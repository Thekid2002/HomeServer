import {ValObject} from "./ValObject";

export class ValString extends ValObject {
    value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }

    toString(): string {
        return this.value;
    }

    toJsonString(): string {
        return this.value;
    }
}

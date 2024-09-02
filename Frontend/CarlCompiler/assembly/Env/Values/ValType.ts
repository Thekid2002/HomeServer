import { ValObject } from "./ValObject";
import { AbstractType } from "../../AST/Nodes/Types/AbstractType";

export class ValType extends ValObject {
    type: AbstractType;

    constructor(type: AbstractType) {
        super();
        this.type = type;
    }

    toString(): string {
        return "type";
    }

    toJsonString(): string {
        return "type";
    }
}

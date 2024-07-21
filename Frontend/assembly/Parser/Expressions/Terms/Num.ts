import {Visitor} from "../../Visitor";
import {Term} from "./Term";

export class Number extends Term {
    value: number;
    constructor(value: number) {
        super();
        this.value = value;
    }
    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitNumber(this);
    }
}

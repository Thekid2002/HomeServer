import {Visitor} from "../../Visitor";
import {AbstractTerm} from "./AbstractTerm";

export class Term extends AbstractTerm{
    value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitTerm(this);
    }

}

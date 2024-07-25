import {ParseVisitor} from "../../ParseVisitor";
import {AbstractTerm} from "./AbstractTerm";

export class Term extends AbstractTerm {
    value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitTerm(this);
    }

}

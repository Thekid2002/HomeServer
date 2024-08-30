import { ParseVisitor } from "../../ParseVisitor";
import { AbstractTerm } from "./AbstractTerm";

export class ParseTerm extends AbstractTerm {
    value: string;

    constructor(value: string, lineNum: i32) {
        super(lineNum);
        this.value = value;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitTerm(this);
    }

    toJsonString(): string {
        return `{"type": "Term", "value": "${this.value}"}`;
    }
}

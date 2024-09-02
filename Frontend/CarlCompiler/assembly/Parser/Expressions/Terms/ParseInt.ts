import { ParseVisitor } from "../../ParseVisitor";
import { Token } from "../../../Lexer/Token";
import { AbstractTerm } from "./AbstractTerm";

export class ParseInt extends AbstractTerm {
    value: Token;

    constructor(value: Token, lineNum: i32) {
        super(lineNum);
        this.value = value;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitInt(this);
    }

    toJsonString(): string {
        return `{"type": "Int", "value": ${this.value.toJsonString()}}`;
    }
}

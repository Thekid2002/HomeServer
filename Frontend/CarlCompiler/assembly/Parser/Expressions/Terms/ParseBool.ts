import { AbstractTerm } from "./AbstractTerm";
import { Token } from "../../../Lexer/Token";
import { ParseVisitor } from "../../ParseVisitor";

export class ParseBool extends AbstractTerm {
    value: Token;

    constructor(value: Token, lineNum: i32) {
        super(lineNum);
        this.value = value;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitBool(this);
    }

    toJsonString(): string {
        return `{"type": "Bool", "value": ${this.value.toJsonString()}}`;
    }
}

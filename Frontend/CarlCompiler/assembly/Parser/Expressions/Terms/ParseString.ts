import {ParseVisitor} from "../../ParseVisitor";
import {Token} from "../../../Lexer/Token";
import {AbstractTerm} from "./AbstractTerm";

export class ParseString extends AbstractTerm {
    value: Token;

    constructor(value: Token, lineNum: i32) {
        super(lineNum);
        this.value = value;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitString(this);
    }

    toJsonString(): string {
        return `{"type": "String", "value": ${this.value.toJsonString()}}`;
    }
}

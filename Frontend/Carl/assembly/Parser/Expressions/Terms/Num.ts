import {ParseVisitor} from "../../ParseVisitor";
import {Term} from "./Term";
import {Token} from "../../../Lexer/Token";
import {AbstractTerm} from "./AbstractTerm";

export class Num extends AbstractTerm {
    value: Token;
    constructor(value: Token, lineNum: i32) {
        super(lineNum);
        this.value = value;
    }
    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitNumber(this);
    }

    toJsonString(): string {
        return `{"type": "Num", "value": ${this.value.toJsonString()}}`;
    }
}

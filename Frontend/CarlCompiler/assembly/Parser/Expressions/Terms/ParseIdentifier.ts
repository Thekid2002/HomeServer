import {Token} from "../../../Lexer/Token";
import {ParseVisitor} from "../../ParseVisitor";
import {ParseTerm} from "./ParseTerm";
import {AbstractTerm} from "./AbstractTerm";

export class ParseIdentifier extends AbstractTerm {
    name: Token;

    constructor(name: Token, lineNum: i32) {
        super(lineNum);
        this.name = name
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitIdentifier(this);
    }

    toJsonString(): string {
        return `{"type": "Identifier", "name": ${this.name.toJsonString()}}`;
    }
}

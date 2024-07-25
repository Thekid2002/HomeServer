import {Token} from "../../../Lexer/Token";
import { ParseVisitor } from "../../ParseVisitor";
import {Term} from "./Term";
import {AbstractTerm} from "./AbstractTerm";

export class Identifier extends AbstractTerm {
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

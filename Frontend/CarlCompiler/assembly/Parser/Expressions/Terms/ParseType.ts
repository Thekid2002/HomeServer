import { AbstractTerm } from "./AbstractTerm";
import { ParseVisitor } from "../../ParseVisitor";
import { Token } from "../../../Lexer/Token";

export class ParseType extends AbstractTerm {
    public name: Token;

    constructor(name: Token, lineNum: i32) {
        super(lineNum);
        this.name = name;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitType(this);
    }

    toJsonString(): string {
        return `{"type": "Type", "name": ${this.name.toJsonString()}}`;
    }
}

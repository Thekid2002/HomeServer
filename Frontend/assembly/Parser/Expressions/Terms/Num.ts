import {ParseVisitor} from "../../ParseVisitor";
import {Term} from "./Term";
import {Token} from "../../../Lexer/Token";
import {AbstractTerm} from "./AbstractTerm";

export class Num extends AbstractTerm {
    value: Token;
    constructor(value: Token) {
        super();
        this.value = value;
    }
    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitNumber(this);
    }
}

import {Visitor} from "../../Visitor";
import {Term} from "./Term";
import {Token} from "../../../Lexer/Token";
import {AbstractTerm} from "./AbstractTerm";

export class Num extends AbstractTerm {
    value: Token;
    constructor(value: Token) {
        super();
        this.value = value;
    }
    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitNumber(this);
    }
}

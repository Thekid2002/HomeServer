import {Token} from "../../../Lexer/Token";
import { Visitor } from "../../Visitor";
import {Term} from "./Term";
import {AbstractTerm} from "./AbstractTerm";

export class Identifier extends AbstractTerm {
    name: Token;

    constructor(name: Token) {
        super();
        this.name = name
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitIdentifier(this);
    }
}

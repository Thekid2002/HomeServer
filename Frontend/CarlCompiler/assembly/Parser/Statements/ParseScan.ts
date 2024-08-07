import {ParseAbstractStatement} from "./ParseAbstractStatement";
import {ParseIdentifier} from "../Expressions/Terms/ParseIdentifier";
import {ParseType} from "../Expressions/Terms/ParseType";
import {ParseVisitor} from "../ParseVisitor";
import {AbstractTerm} from "../Expressions/Terms/AbstractTerm";

export class ParseScan extends ParseAbstractStatement {
    message: AbstractTerm;
    identifier: ParseIdentifier;
    type: ParseType;

    constructor(message: AbstractTerm, type: ParseType, identifier: ParseIdentifier, lineNum: i32) {
        super(lineNum);
        this.message = message;
        this.type = type;
        this.identifier = identifier;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitScan(this);
    }

    toJsonString(): string {
        return this.type.toJsonString() + ", " + this.identifier.toJsonString();
    }
}

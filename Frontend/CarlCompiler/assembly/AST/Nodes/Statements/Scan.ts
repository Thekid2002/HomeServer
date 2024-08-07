import {AbstractStatement} from "./AbstractStatement";
import {ASTVisitor} from "../../ASTVisitor";
import {AbstractNode} from "../AbstractNode";
import {Identifier} from "../Expressions/Terms/Identifier";
import {ValueType} from "../Types/ValueType";
import {ASTString} from "../Expressions/Terms/ASTString";
import {AbstractExpression} from "../Expressions/AbstractExpression";

export class Scan extends AbstractStatement {
    message: AbstractExpression;
    identifier: Identifier;
    type: ValueType;

    constructor(message: AbstractExpression, type: ValueType, identifier: Identifier, lineNum: i32) {
        super(lineNum);
        this.message = message;
        this.type = type;
        this.identifier = identifier;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitScan(this);
    }

    clone(): AbstractNode {
        return new Scan(
            this.message.clone() as ASTString,
            this.type.clone() as ValueType,
            this.identifier.clone() as Identifier,
            this.lineNum
        );
    }

    toString(): string {
        return "Scan(" + this.message.toString() + ", " + this.type.toString() + ", " + this.identifier.toString() + ")";
    }
}
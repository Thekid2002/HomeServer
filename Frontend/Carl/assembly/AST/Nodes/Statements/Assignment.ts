import {Identifier} from "../Expressions/Terms/Identifier";
import {AbstractStatement} from "./AbstractStatement";
import {AbstractExpression} from "../Expressions/AbstractExpression";
import { ASTVisitor } from "../../ASTVisitor";

export class Assignment extends AbstractStatement {
    identifier: Identifier;
    expression: AbstractExpression;

    constructor(identifier: Identifier, expression: AbstractExpression, lineNum: i32) {
        super(lineNum);
        this.identifier = identifier;
        this.expression = expression;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitAssignment(this);
    }
}

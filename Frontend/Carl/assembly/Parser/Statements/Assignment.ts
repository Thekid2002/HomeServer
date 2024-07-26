import {AbstractStatement} from "./AbstractStatement";
import {Identifier} from "../Expressions/Terms/Identifier";
import {AbstractExpression} from "../Expressions/AbstractExpression";
import { ParseVisitor } from "../ParseVisitor";

export class Assignment extends AbstractStatement {
    identifier: Identifier;
    expression: AbstractExpression;

    constructor(identifier: Identifier, expression: AbstractExpression, lineNum: i32) {
        super(lineNum);
        this.identifier = identifier;
        this.expression = expression;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitAssignment(this);

    }

    toJsonString(): string {
        return `{"type": "Assignment", "identifier": "${this.identifier.name.literal}", "expression": "${this.expression.toJsonString()}"}`;
    }
}

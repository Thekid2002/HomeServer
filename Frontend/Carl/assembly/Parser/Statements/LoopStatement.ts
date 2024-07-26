import {AbstractStatement} from "./AbstractStatement";
import {AbstractExpression} from "../Expressions/AbstractExpression";
import {ParseVisitor} from "../ParseVisitor";

export class LoopStatement extends AbstractStatement {
    declaration: AbstractStatement | null;
    expression: AbstractExpression;
    body: AbstractStatement;

    constructor(declaration: AbstractStatement | null, expression: AbstractExpression, body: AbstractStatement, lineNum: i32) {
        super(lineNum);
        this.expression = expression;
        this.body = body;
        this.declaration = declaration
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitLoopStatement(this);
    }

    toJsonString(): string {
        return `{"type": "LoopStatement", "expression": ${this.expression.toJsonString()}, "body": ${this.body.toJsonString()}}`;
    }
}

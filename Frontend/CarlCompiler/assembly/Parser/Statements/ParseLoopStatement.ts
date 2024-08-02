import {ParseAbstractStatement} from "./ParseAbstractStatement";
import {ParseAbstractExpression} from "../Expressions/ParseAbstractExpression";
import {ParseVisitor} from "../ParseVisitor";

export class ParseLoopStatement extends ParseAbstractStatement {
    declaration: ParseAbstractStatement | null;
    expression: ParseAbstractExpression;
    body: ParseAbstractStatement;

    constructor(declaration: ParseAbstractStatement | null, expression: ParseAbstractExpression, body: ParseAbstractStatement, lineNum: i32) {
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

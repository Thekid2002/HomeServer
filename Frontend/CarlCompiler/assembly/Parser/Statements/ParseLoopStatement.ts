import { ParseAbstractStatement } from "./ParseAbstractStatement";
import { ParseAbstractExpression } from "../Expressions/ParseAbstractExpression";
import { ParseVisitor } from "../ParseVisitor";

export class ParseLoopStatement extends ParseAbstractStatement {
    initiator: ParseAbstractStatement | null;
    condition: ParseAbstractExpression;
    body: ParseAbstractStatement;

    constructor(
        initiator: ParseAbstractStatement | null,
        condition: ParseAbstractExpression,
        body: ParseAbstractStatement,
        lineNum: i32
    ) {
        super(lineNum);
        this.condition = condition;
        this.body = body;
        this.initiator = initiator;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitLoopStatement(this);
    }

    toJsonString(): string {
        return `{"type": "LoopStatement", "expression": ${this.condition.toJsonString()}, "body": ${this.body.toJsonString()}}`;
    }
}

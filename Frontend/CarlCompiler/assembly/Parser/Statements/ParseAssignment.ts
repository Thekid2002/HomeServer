import { ParseAbstractStatement } from "./ParseAbstractStatement";
import { ParseIdentifier } from "../Expressions/Terms/ParseIdentifier";
import { ParseAbstractExpression } from "../Expressions/ParseAbstractExpression";
import { ParseVisitor } from "../ParseVisitor";

export class ParseAssignment extends ParseAbstractStatement {
    identifier: ParseIdentifier;
    expression: ParseAbstractExpression;

    constructor(
        identifier: ParseIdentifier,
        expression: ParseAbstractExpression,
        lineNum: i32
    ) {
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

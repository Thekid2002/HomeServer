import { Token } from "../../Lexer/Token";
import { ParseVisitor } from "../ParseVisitor";
import { ParseAbstractExpression } from "./ParseAbstractExpression";
import { ParseAdditiveExpression } from "./ParseAdditiveExpression";

export class ParseRelationalExpression extends ParseAbstractExpression {
    primaryOrLeft: ParseAbstractExpression;
    operator: Token | null;
    right: ParseAbstractExpression | null;

    constructor(
        primaryOrLeft: ParseAbstractExpression,
        operator: Token | null,
        right: ParseAbstractExpression | null,
        lineNum: i32
    ) {
        super(lineNum);
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitRelationalExpression(this);
    }

    toJsonString(): string {
        return (
            `{"type": "RelationalExpression", "primaryOrLeft": ${this.primaryOrLeft.toJsonString()},` +
      `operator": ${this.operator ? this.operator!.toJsonString() : "\"\""},` +
      `"right": ${this.right ? this.right!.toJsonString() : "\"\""}}`
        );
    }
}

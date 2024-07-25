import {Token} from "../../Lexer/Token";
import {ParseVisitor} from "../ParseVisitor";
import {AbstractExpression} from "./AbstractExpression";
import {MultiplicativeExpression} from "./MultiplicativeExpression";
import {UnaryExpression} from "./UnaryExpression";

export class PowExpression extends AbstractExpression {
    primaryOrLeft: AbstractExpression;
    operator: Token | null;
    right: AbstractExpression | null;

    constructor(primaryOrLeft: AbstractExpression, operator: Token | null, right: AbstractExpression | null, lineNum: i32) {
        super(lineNum);
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitPowExpression(this);
    }

    toJsonString(): string {
        return `{"type": "PowExpression", "primaryOrLeft": ${this.primaryOrLeft.toJsonString()},` +
            `operator": ${this.operator ? this.operator!.toJsonString() : "\"\""},` +
            `"right": ${this.right ? this.right!.toJsonString() : "\"\""}}`;
    }
}

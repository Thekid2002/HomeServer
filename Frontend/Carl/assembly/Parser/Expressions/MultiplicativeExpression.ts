import { Token } from "../../Lexer/Token";
import { ParseVisitor } from "../ParseVisitor";
import { Expression } from "./Expression";
import {AbstractExpression} from "./AbstractExpression";
import {UnaryExpression} from "./UnaryExpression";
import {PowExpression} from "./PowExpression";

export class MultiplicativeExpression extends AbstractExpression
{
    primaryOrLeft: AbstractExpression;
    operator: Token | null;
    right: AbstractExpression | null;

    constructor(primaryOrLeft: AbstractExpression, operator: Token | null, right: AbstractExpression | null, lineNum: i32) {
        super(lineNum);
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ParseVisitor<T>): T
    {
        return visitor.visitMultiplicativeExpression(this);
    }

    toJsonString(): string
    {
        return `{"type": "MultiplicativeExpression", "primaryOrLeft": ${this.primaryOrLeft.toJsonString()},` +
            `operator": ${this.operator ? this.operator!.toJsonString() : "\"\""},` +
            `"right": ${this.right ? this.right!.toJsonString() : "\"\""}}`;
    }
}

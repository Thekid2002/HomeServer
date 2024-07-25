import { ParseVisitor } from "../ParseVisitor";
import {Expression} from "./Expression";
import {Token} from "../../Lexer/Token";
import {AbstractExpression} from "./AbstractExpression";
import {RelationalExpression} from "./RelationalExpression";

export class EqualityExpression extends AbstractExpression {
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
        return visitor.visitEqualityExpression(this);
    }

    toString(): string {
        return "EqualityExpression";
    }

    toJsonString(): string {
        return `{"type": "EqualityExpression", "primaryOrLeft": ${this.primaryOrLeft.toJsonString()},` +
         `operator": ${this.operator ? this.operator!.toJsonString() : "\"\""},`+
            `"right": ${this.right? this.right!.toJsonString(): "\"\""}}`;
    }
}

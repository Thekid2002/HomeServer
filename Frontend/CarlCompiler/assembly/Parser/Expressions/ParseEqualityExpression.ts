import {ParseVisitor} from "../ParseVisitor";
import {ParseExpression} from "./ParseExpression";
import {Token} from "../../Lexer/Token";
import {ParseAbstractExpression} from "./ParseAbstractExpression";
import {ParseRelationalExpression} from "./ParseRelationalExpression";

export class ParseEqualityExpression extends ParseAbstractExpression {
    primaryOrLeft: ParseAbstractExpression;
    operator: Token | null;
    right: ParseAbstractExpression | null;

    constructor(primaryOrLeft: ParseAbstractExpression, operator: Token | null, right: ParseAbstractExpression | null, lineNum: i32) {
        super(lineNum);
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitEqualityExpression(this);
    }

    toString(): string {
        return "ParseEqualityExpression";
    }

    toJsonString(): string {
        return `{"type": "EqualityExpression", "primaryOrLeft": ${this.primaryOrLeft.toJsonString()},` +
            `operator": ${this.operator ? this.operator!.toJsonString() : "\"\""},` +
            `"right": ${this.right ? this.right!.toJsonString() : "\"\""}}`;
    }
}

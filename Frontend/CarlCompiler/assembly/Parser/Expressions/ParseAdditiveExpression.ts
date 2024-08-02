import {Token} from "../../Lexer/Token";
import {ParseVisitor} from "../ParseVisitor";
import {ParseAbstractExpression} from "./ParseAbstractExpression";
import {ParseMultiplicativeExpression} from "./ParseMultiplicativeExpression";

export class ParseAdditiveExpression extends ParseAbstractExpression {
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
        return visitor.visitAdditiveExpression(this);
    }

    toJsonString(): string {
        return `{"type": "AdditiveExpression", "primaryOrLeft": ${this.primaryOrLeft.toJsonString()},` +
            `operator": ${this.operator ? this.operator!.toJsonString() : "\"\""},` +
            `"right": ${this.right ? this.right!.toJsonString() : "\"\""}}`;
    }
}

import {Token} from "../../Lexer/Token";
import {ParseVisitor} from "../ParseVisitor";
import {ParseExpression} from "./ParseExpression";
import {ParseAbstractExpression} from "./ParseAbstractExpression";
import {ParseUnaryExpression} from "./ParseUnaryExpression";
import {ParsePowExpression} from "./ParsePowExpression";

export class ParseMultiplicativeExpression extends ParseAbstractExpression {
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
        return visitor.visitMultiplicativeExpression(this);
    }

    toJsonString(): string {
        return `{"type": "MultiplicativeExpression", "primaryOrLeft": ${this.primaryOrLeft.toJsonString()},` +
            `operator": ${this.operator ? this.operator!.toJsonString() : "\"\""},` +
            `"right": ${this.right ? this.right!.toJsonString() : "\"\""}}`;
    }
}

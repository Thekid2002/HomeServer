import {ParseVisitor} from "../ParseVisitor";
import {Token} from "../../Lexer/Token";
import {ParseAbstractExpression} from "./ParseAbstractExpression";
import {ParseEqualityExpression} from "./ParseEqualityExpression";

export class ParseExpression extends ParseAbstractExpression {
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
        return visitor.visitExpression(this);
    }

    toJsonString(): string {
        return `{"type": "Expression", "primaryOrLeft": ${this.primaryOrLeft.toJsonString()},` +
            `operator": ${this.operator ? this.operator!.toJsonString() : "\"\""},` +
            `"right": ${this.right ? this.right!.toJsonString() : "\"\""}}`;
    }
}

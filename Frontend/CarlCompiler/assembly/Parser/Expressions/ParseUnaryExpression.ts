import {Token} from "../../Lexer/Token";
import {ParseVisitor} from "../ParseVisitor";
import {ParseAbstractExpression} from "./ParseAbstractExpression";

export class ParseUnaryExpression extends ParseAbstractExpression {
    operator: Token | null;
    primaryOrRight: ParseAbstractExpression;

    constructor(operator: Token | null, primaryOrRight: ParseAbstractExpression, lineNum: i32) {
        super(lineNum);
        this.operator = operator;
        this.primaryOrRight = primaryOrRight;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitUnaryExpression(this);
    }

    toJsonString(): string {
        return `{"type": "UnaryExpression", "operator": ${this.operator ? this.operator!.toJsonString() : "\"\""}, "primaryOrRight": ${this.primaryOrRight.toJsonString()}}`;
    }
}

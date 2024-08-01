import {Token} from "../../Lexer/Token";
import {ParseVisitor} from "../ParseVisitor";
import {AbstractExpression} from "./AbstractExpression";

export class UnaryExpression extends AbstractExpression {
    operator: Token | null;
    primaryOrRight: AbstractExpression;

    constructor(operator: Token | null, primaryOrRight: AbstractExpression, lineNum: i32) {
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

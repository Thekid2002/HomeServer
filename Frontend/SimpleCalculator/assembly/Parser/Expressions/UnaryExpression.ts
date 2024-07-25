import {Token} from "../../Lexer/Token";
import {ParseVisitor} from "../ParseVisitor";
import {AbstractExpression} from "./AbstractExpression";

export class UnaryExpression extends AbstractExpression {
    operator: Token | null;
    primaryOrRight: AbstractExpression;

    constructor(operator: Token | null, primaryOrRight: AbstractExpression) {
        super();
        this.operator = operator;
        this.primaryOrRight = primaryOrRight;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitUnaryExpression(this);
    }
}

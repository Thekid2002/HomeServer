import {Token} from "../../Lexer/Token";
import {Visitor} from "../Visitor";
import {AbstractExpression} from "./AbstractExpression";

export class UnaryExpression extends AbstractExpression {
    operator: Token | null;
    primaryOrRight: AbstractExpression;

    constructor(operator: Token | null, primaryOrRight: AbstractExpression) {
        super();
        this.operator = operator;
        this.primaryOrRight = primaryOrRight;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitUnaryExpression(this);
    }
}

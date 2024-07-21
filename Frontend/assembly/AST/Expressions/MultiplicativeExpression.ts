import { Token } from "../../Lexer/Token";
import { Visitor } from "../Visitor";
import { Expression } from "./Expression";
import {AbstractExpression} from "./AbstractExpression";
import {UnaryExpression} from "./UnaryExpression";

export class MultiplicativeExpression extends AbstractExpression
{
    primaryOrLeft: UnaryExpression;
    operator: Token | null;
    right: AbstractExpression | null;

    constructor(primaryOrLeft: UnaryExpression, operator: Token | null, right: AbstractExpression | null) {
        super();
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: Visitor<T>): T
    {
        return visitor.visitMultiplicativeExpression(this);
    }

}

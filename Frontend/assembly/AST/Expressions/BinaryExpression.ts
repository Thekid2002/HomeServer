import { Token } from "../../Lexer/Token";
import { Visitor } from "../Visitor";
import {AbstractExpression} from "./AbstractExpression";
import {MultiplicativeExpression} from "./MultiplicativeExpression";

export class BinaryExpression extends AbstractExpression {
    primaryOrLeft: MultiplicativeExpression;
    operator: Token | null;
    right: AbstractExpression | null;

    constructor(primaryOrLeft: MultiplicativeExpression, operator: Token | null, right: AbstractExpression | null) {
        super();
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitBinaryExpression(this);
    }

}

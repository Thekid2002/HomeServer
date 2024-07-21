import { Token } from "../../Lexer/Token";
import { ParseVisitor } from "../ParseVisitor";
import {AbstractExpression} from "./AbstractExpression";
import {MultiplicativeExpression} from "./MultiplicativeExpression";
import {UnaryExpression} from "./UnaryExpression";

export class PowExpression extends AbstractExpression {
    primaryOrLeft: UnaryExpression;
    operator: Token | null;
    right: AbstractExpression | null;

    constructor(primaryOrLeft: UnaryExpression, operator: Token | null, right: AbstractExpression | null) {
        super();
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitPowExpression(this);
    }

}

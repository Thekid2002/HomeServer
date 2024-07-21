import { Token } from "../../Lexer/Token";
import { ParseVisitor } from "../ParseVisitor";
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

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitBinaryExpression(this);
    }

}

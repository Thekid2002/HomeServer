import { ParseVisitor } from "../ParseVisitor";
import {Expression} from "./Expression";
import {Token} from "../../Lexer/Token";
import {AbstractExpression} from "./AbstractExpression";
import {RelationalExpression} from "./RelationalExpression";

export class EqualityExpression extends AbstractExpression {
    primaryOrLeft: RelationalExpression;
    operator: Token | null;
    right: AbstractExpression | null;

    constructor(primaryOrLeft: RelationalExpression, operator: Token | null, right: AbstractExpression | null) {
        super();
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitEqualityExpression(this);
    }

    toString(): string {
        return "EqualityExpression";
    }
}

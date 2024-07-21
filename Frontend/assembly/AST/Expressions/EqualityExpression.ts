import {Token} from "../../Lexer/Token";
import {AbstractExpression} from "./AbstractExpression";
import {RelationalExpression} from "./RelationalExpression";
import {ASTVisitor} from "../ASTVisitor";

export class EqualityExpression extends AbstractExpression {
    primaryOrLeft: AbstractExpression;
    operator: string;
    right: AbstractExpression;

    constructor(primaryOrLeft: AbstractExpression, operator: string, right: AbstractExpression) {
        super();
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitEqualityExpression(this);
    }

    toString(): string {
        return "EqualityExpression";
    }
}

import {AbstractExpression} from "./AbstractExpression";
import {ASTVisitor} from "../ASTVisitor";

export class UnaryExpression extends AbstractExpression {
    operator: string;
    primaryOrRight: AbstractExpression;

    constructor(operator: string, primaryOrRight: AbstractExpression) {
        super();
        this.operator = operator;
        this.primaryOrRight = primaryOrRight;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitUnaryExpression(this);
    }
}

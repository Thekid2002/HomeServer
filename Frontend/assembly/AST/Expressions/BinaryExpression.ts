import {AbstractExpression} from "./AbstractExpression";
import {ASTVisitor} from "../ASTVisitor";

export class BinaryExpression extends AbstractExpression {
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
        return visitor.visitBinaryExpression(this);
    }

}

import {AbstractExpression} from "./AbstractExpression";
import {ASTVisitor} from "../../ASTVisitor";

export class BinaryExpression extends AbstractExpression {
    primaryOrLeft: AbstractExpression;
    operator: string;
    right: AbstractExpression;

    constructor(primaryOrLeft: AbstractExpression, operator: string, right: AbstractExpression, lineNum: i32) {
        super(lineNum);
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitBinaryExpression(this);
    }
}

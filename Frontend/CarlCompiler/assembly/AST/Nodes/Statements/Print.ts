import {AbstractStatement} from "./AbstractStatement";
import {AbstractExpression} from "../Expressions/AbstractExpression";
import {ASTVisitor} from "../../ASTVisitor";
import {ValueType} from "../Types/ValueType";

export class Print extends AbstractStatement {
    expression: AbstractExpression;

    constructor(expression: AbstractExpression, lineNum: i32) {
        super(lineNum);
        this.expression = expression;
    }


    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitPrint(this);
    }
}

import { Token } from "../../Lexer/Token";
import {AbstractExpression} from "./AbstractExpression";
import {BinaryExpression} from "./BinaryExpression";
import {ASTVisitor} from "../ASTVisitor";

export class RelationalExpression extends AbstractExpression
{
    primaryOrLeft: AbstractExpression;
    operator: string;
    right: AbstractExpression;

    constructor(primaryOrLeft: AbstractExpression, operator: string, right: AbstractExpression)
    {
        super();
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ASTVisitor<T>): T
    {
        return visitor.visitRelationalExpression(this);
    }

}

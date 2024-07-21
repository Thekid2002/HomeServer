import { Token } from "../../Lexer/Token";
import { ParseVisitor } from "../ParseVisitor";
import {AbstractExpression} from "./AbstractExpression";
import {BinaryExpression} from "./BinaryExpression";

export class RelationalExpression extends AbstractExpression
{
    primaryOrLeft: BinaryExpression;
    operator: Token | null;
    right: AbstractExpression | null;

    constructor(primaryOrLeft: BinaryExpression, operator: Token | null, right: AbstractExpression | null)
    {
        super();
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ParseVisitor<T>): T
    {
        return visitor.visitRelationalExpression(this);
    }

}

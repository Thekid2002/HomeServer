import {Token} from "../../Lexer/Token";
import {AbstractExpression} from "./AbstractExpression";
import {EqualityExpression} from "./EqualityExpression";
import {ASTVisitor} from "../ASTVisitor";

export class Expression extends AbstractExpression {
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
        return visitor.visitExpression(this);
    }

}

import {ParseVisitor} from "../ParseVisitor";
import {Token} from "../../Lexer/Token";
import {AbstractExpression} from "./AbstractExpression";
import {EqualityExpression} from "./EqualityExpression";

export class Expression extends AbstractExpression {
    primaryOrLeft: EqualityExpression;
    operator: Token | null;
    right: AbstractExpression | null;

    constructor(primaryOrLeft: EqualityExpression, operator: Token | null, right: AbstractExpression | null) {
        super();
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitExpression(this);
    }

}

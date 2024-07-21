import {Expression} from "./Expressions/Expression";
import {EqualityExpression} from "./Expressions/EqualityExpression";
import {RelationalExpression} from "./Expressions/RelationalExpression";
import {BinaryExpression} from "./Expressions/BinaryExpression";
import {MultiplicativeExpression} from "./Expressions/MultiplicativeExpression";
import {UnaryExpression} from "./Expressions/UnaryExpression";
import {Term} from "./Expressions/Terms/Term";
import {Num} from "./Expressions/Terms/Num";
import {Identifier} from "./Expressions/Terms/Identifier";

export interface ASTVisitor<T> {
    visitExpression(expression: Expression): T;
    visitEqualityExpression(expression: EqualityExpression): T;
    visitRelationalExpression(expression: RelationalExpression): T;
    visitBinaryExpression(expression: BinaryExpression): T;
    visitMultiplicativeExpression(expression: MultiplicativeExpression): T;
    visitUnaryExpression(expression: UnaryExpression): T;

    visitTerm(term: Term): T;
    visitNumber(term: Num): T;

    visitIdentifier(term: Identifier): T;
}

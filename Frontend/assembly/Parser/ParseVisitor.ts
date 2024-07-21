import {BinaryExpression} from "./Expressions/BinaryExpression";
import {Expression} from "./Expressions/Expression";
import {RelationalExpression} from "./Expressions/RelationalExpression";
import {EqualityExpression} from "./Expressions/EqualityExpression";
import {MultiplicativeExpression} from "./Expressions/MultiplicativeExpression";
import {UnaryExpression} from "./Expressions/UnaryExpression";
import {Num} from "./Expressions/Terms/Num";
import {Term} from "./Expressions/Terms/Term";
import {Identifier} from "./Expressions/Terms/Identifier";

export interface Visitor<T> {
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

import {AdditiveExpression} from "./Expressions/AdditiveExpression";
import {Expression} from "./Expressions/Expression";
import {RelationalExpression} from "./Expressions/RelationalExpression";
import {EqualityExpression} from "./Expressions/EqualityExpression";
import {MultiplicativeExpression} from "./Expressions/MultiplicativeExpression";
import {UnaryExpression} from "./Expressions/UnaryExpression";
import {Num} from "./Expressions/Terms/Num";
import {Term} from "./Expressions/Terms/Term";
import {Identifier} from "./Expressions/Terms/Identifier";
import {PowExpression} from "./Expressions/PowExpression";

export interface ParseVisitor<T> {
    visitExpression(expression: Expression): T;

    visitEqualityExpression(expression: EqualityExpression): T;

    visitRelationalExpression(expression: RelationalExpression): T;

    visitBinaryExpression(expression: AdditiveExpression): T;

    visitMultiplicativeExpression(expression: MultiplicativeExpression): T;

    visitUnaryExpression(expression: UnaryExpression): T;

    visitPowExpression(expression: PowExpression): T;

    visitTerm(term: Term): T;

    visitNumber(term: Num): T;

    visitIdentifier(term: Identifier): T;
}

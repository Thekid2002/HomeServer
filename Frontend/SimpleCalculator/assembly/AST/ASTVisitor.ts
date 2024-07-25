import {BinaryExpression} from "./Expressions/BinaryExpression";
import {UnaryExpression} from "./Expressions/UnaryExpression";
import {Term} from "./Expressions/Terms/Term";
import {Num} from "./Expressions/Terms/Num";
import {Identifier} from "./Expressions/Terms/Identifier";

export interface ASTVisitor<T> {
    visitBinaryExpression(expression: BinaryExpression): T;

    visitUnaryExpression(expression: UnaryExpression): T;

    visitTerm(term: Term): T;

    visitNumber(term: Num): T;

    visitIdentifier(term: Identifier): T;
}

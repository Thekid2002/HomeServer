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
import {Declaration} from "./Statements/Declaration";
import {Type} from "./Expressions/Terms/Type";
import {CompoundStatement} from "./Statements/CompoundStatement";
import {Program} from "./Statements/Program";
import {Print} from "./Statements/Print";
import {LoopStatement} from "./Statements/LoopStatement";
import {Assignment} from "./Statements/Assignment";

export interface ParseVisitor<T> {
    visitExpression(expression: Expression): T;

    visitEqualityExpression(expression: EqualityExpression): T;

    visitRelationalExpression(expression: RelationalExpression): T;

    visitMultiplicativeExpression(expression: MultiplicativeExpression): T;

    visitUnaryExpression(expression: UnaryExpression): T;

    visitPowExpression(expression: PowExpression): T;

    visitAdditiveExpression(expression: AdditiveExpression): T;

    visitTerm(term: Term): T;

    visitNumber(term: Num): T;

    visitIdentifier(term: Identifier): T;

    visitDeclaration(statement: Declaration): T;

    visitType(type: Type): T;

    visitCompoundStatement(statement: CompoundStatement): T;

    visitProgram(statement: Program): T;

    visitPrint(statement: Print): T;

    visitLoopStatement(statement: LoopStatement): T;

    visitAssignment(statement: Assignment): T;
}

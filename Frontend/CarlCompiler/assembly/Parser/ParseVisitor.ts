import {ParseAdditiveExpression} from "./Expressions/ParseAdditiveExpression";
import {ParseExpression} from "./Expressions/ParseExpression";
import {ParseRelationalExpression} from "./Expressions/ParseRelationalExpression";
import {ParseEqualityExpression} from "./Expressions/ParseEqualityExpression";
import {ParseMultiplicativeExpression} from "./Expressions/ParseMultiplicativeExpression";
import {ParseUnaryExpression} from "./Expressions/ParseUnaryExpression";
import {ParseNum} from "./Expressions/Terms/ParseNum";
import {ParseTerm} from "./Expressions/Terms/ParseTerm";
import {ParseIdentifier} from "./Expressions/Terms/ParseIdentifier";
import {ParsePowExpression} from "./Expressions/ParsePowExpression";
import {ParseDeclaration} from "./Statements/ParseDeclaration";
import {ParseType} from "./Expressions/Terms/ParseType";
import {ParseProgram} from "./Statements/ParseProgram";
import {ParsePrint} from "./Statements/ParsePrint";
import {ParseLoopStatement} from "./Statements/ParseLoopStatement";
import {ParseAssignment} from "./Statements/ParseAssignment";
import {ParseIfStatement} from "./Statements/ParseIfStatement";
import {ParseCompoundStatement} from "./Statements/ParseCompoundStatement";
import {ParseString} from "./Expressions/Terms/ParseString";
import {ParseScan} from "./Statements/ParseScan";
import {ParseIncrement} from "./Statements/ParseIncrement";

export interface ParseVisitor<T> {
    visitExpression(expression: ParseExpression): T;

    visitEqualityExpression(expression: ParseEqualityExpression): T;

    visitRelationalExpression(expression: ParseRelationalExpression): T;

    visitMultiplicativeExpression(expression: ParseMultiplicativeExpression): T;

    visitUnaryExpression(expression: ParseUnaryExpression): T;

    visitPowExpression(expression: ParsePowExpression): T;

    visitAdditiveExpression(expression: ParseAdditiveExpression): T;

    visitTerm(term: ParseTerm): T;

    visitNumber(term: ParseNum): T;

    visitIdentifier(term: ParseIdentifier): T;

    visitDeclaration(statement: ParseDeclaration): T;

    visitType(type: ParseType): T;

    visitProgram(statement: ParseProgram): T;

    visitPrint(statement: ParsePrint): T;

    visitLoopStatement(statement: ParseLoopStatement): T;

    visitAssignment(statement: ParseAssignment): T;

    visitIfStatement(statement: ParseIfStatement): T;

    visitCompoundStatement(statement: ParseCompoundStatement): T;

    visitString(term: ParseString): T;

    visitScan(statement: ParseScan): T;

    visitIncrement(statement: ParseIncrement): T;
}

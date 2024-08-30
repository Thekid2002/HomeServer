import { ParseAdditiveExpression } from "./Expressions/ParseAdditiveExpression";
import { ParseExpression } from "./Expressions/ParseExpression";
import { ParseRelationalExpression } from "./Expressions/ParseRelationalExpression";
import { ParseEqualityExpression } from "./Expressions/ParseEqualityExpression";
import { ParseMultiplicativeExpression } from "./Expressions/ParseMultiplicativeExpression";
import { ParseUnaryExpression } from "./Expressions/ParseUnaryExpression";
import { ParseInt } from "./Expressions/Terms/ParseInt";
import { ParseTerm } from "./Expressions/Terms/ParseTerm";
import { ParseIdentifier } from "./Expressions/Terms/ParseIdentifier";
import { ParsePowExpression } from "./Expressions/ParsePowExpression";
import { ParseDeclaration } from "./Statements/ParseDeclaration";
import { ParseType } from "./Expressions/Terms/ParseType";
import { ParseProgram } from "./Statements/ParseProgram";
import { ParseLoopStatement } from "./Statements/ParseLoopStatement";
import { ParseAssignment } from "./Statements/ParseAssignment";
import { ParseIfStatement } from "./Statements/ParseIfStatement";
import { ParseCompoundStatement } from "./Statements/ParseCompoundStatement";
import { ParseString } from "./Expressions/Terms/ParseString";
import { ParseIncrement } from "./Statements/ParseIncrement";
import { ParseBool } from "./Expressions/Terms/ParseBool";
import { ParseFunctionDeclaration } from "./Statements/ParseFunctionDeclaration";
import { ParseFunctionCallStatement } from "./Statements/ParseFunctionCallStatement";
import { ParseFunctionCallExpression } from "./Expressions/Terms/ParseFunctionCallExpression";
import { ParseReturn } from "./Statements/ParseReturn";
import { ParseImport } from "./Statements/ParseImport";
import { ParseDouble } from "./Expressions/Terms/ParseDouble";

export interface ParseVisitor<T> {
  visitExpression(expression: ParseExpression): T;

  visitEqualityExpression(expression: ParseEqualityExpression): T;

  visitRelationalExpression(expression: ParseRelationalExpression): T;

  visitMultiplicativeExpression(expression: ParseMultiplicativeExpression): T;

  visitUnaryExpression(expression: ParseUnaryExpression): T;

  visitPowExpression(expression: ParsePowExpression): T;

  visitAdditiveExpression(expression: ParseAdditiveExpression): T;

  visitTerm(term: ParseTerm): T;

  visitInt(term: ParseInt): T;

  visitDouble(term: ParseDouble): T;

  visitIdentifier(term: ParseIdentifier): T;

  visitDeclaration(statement: ParseDeclaration): T;

  visitType(type: ParseType): T;

  visitProgram(statement: ParseProgram): T;

  visitLoopStatement(statement: ParseLoopStatement): T;

  visitAssignment(statement: ParseAssignment): T;

  visitIfStatement(statement: ParseIfStatement): T;

  visitCompoundStatement(statement: ParseCompoundStatement): T;

  visitString(term: ParseString): T;

  visitIncrement(statement: ParseIncrement): T;

  visitBool(term: ParseBool): T;

  visitFunction(statement: ParseFunctionDeclaration): T;

  visitFunctionCallExpression(expression: ParseFunctionCallExpression): T;

  visitFunctionCallStatement(statement: ParseFunctionCallStatement): T;

  visitReturn(statement: ParseReturn): T;

  visitImport(statement: ParseImport): T;
}

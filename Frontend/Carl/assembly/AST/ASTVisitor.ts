import {BinaryExpression} from "./Nodes/Expressions/BinaryExpression";
import {UnaryExpression} from "./Nodes/Expressions/UnaryExpression";
import {Term} from "./Nodes/Expressions/Terms/Term";
import {Num} from "./Nodes/Expressions/Terms/Num";
import {Identifier} from "./Nodes/Expressions/Terms/Identifier";
import {ValueType} from "./Nodes/Types/ValueType";
import {Declaration} from "./Nodes/Statements/Declaration";
import {CompoundStatement} from "./Nodes/Statements/CompoundStatement";
import {Program} from "./Nodes/Statements/Program";
import {Print} from "./Nodes/Statements/Print";

export interface ASTVisitor<T> {
    visitBinaryExpression(expression: BinaryExpression): T;

    visitUnaryExpression(expression: UnaryExpression): T;

    visitTerm(term: Term): T;

    visitNumber(term: Num): T;

    visitIdentifier(term: Identifier): T;

    visitDeclaration(param: Declaration): T;

    visitValueType(type: ValueType): T;

    visitCompoundStatement(param: CompoundStatement): T;

    visitProgram(param: Program): T;

    visitPrint(param: Print): T;
}

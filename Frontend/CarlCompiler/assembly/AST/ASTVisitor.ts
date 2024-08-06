import {BinaryExpression} from "./Nodes/Expressions/BinaryExpression";
import {UnaryExpression} from "./Nodes/Expressions/UnaryExpression";
import {Term} from "./Nodes/Expressions/Terms/Term";
import {Num} from "./Nodes/Expressions/Terms/Num";
import {Identifier} from "./Nodes/Expressions/Terms/Identifier";
import {ValueType} from "./Nodes/Types/ValueType";
import {Declaration} from "./Nodes/Statements/Declaration";
import {Program} from "./Nodes/Statements/Program";
import {Print} from "./Nodes/Statements/Print";
import {While} from "./Nodes/Statements/While";
import {Assignment} from "./Nodes/Statements/Assignment";
import {StatementType} from "./Nodes/Types/StatementType";
import {IfStatement} from "./Nodes/Statements/IfStatement";
import {CompoundStatement} from "./Nodes/Statements/CompoundStatement";
import {ASTString} from "./Nodes/Expressions/Terms/ASTString";
import {Scan} from "./Nodes/Statements/Scan";

export interface ASTVisitor<T> {
    visitBinaryExpression(expression: BinaryExpression): T;

    visitUnaryExpression(expression: UnaryExpression): T;

    visitTerm(term: Term): T;

    visitNumber(term: Num): T;

    visitIdentifier(term: Identifier): T;

    visitDeclaration(statement: Declaration): T;

    visitValueType(type: ValueType): T;

    visitProgram(statement: Program): T;

    visitPrint(statement: Print): T;

    visitWhile(statement: While): T;

    visitAssignment(statement: Assignment): T;

    visitStatementType(statement: StatementType): T;

    visitIfStatement(statement: IfStatement): T;

    visitCompoundStatement(statement: CompoundStatement): T;

    visitString(term: ASTString): T;

    visitScan(statement: Scan): T;
}

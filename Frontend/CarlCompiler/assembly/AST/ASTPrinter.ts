import {ASTVisitor} from "./ASTVisitor";
import {BinaryExpression} from "./Nodes/Expressions/BinaryExpression";
import {Identifier} from "./Nodes/Expressions/Terms/Identifier";
import {Num} from "./Nodes/Expressions/Terms/Num";
import {Term} from "./Nodes/Expressions/Terms/Term";
import {UnaryExpression} from "./Nodes/Expressions/UnaryExpression";
import {ValueType} from "./Nodes/Types/ValueType";
import {Declaration} from "./Nodes/Statements/Declaration";
import {Program} from "./Nodes/Statements/Program";
import {Print} from "./Nodes/Statements/Print";
import { While } from "./Nodes/Statements/While";
import { Assignment } from "./Nodes/Statements/Assignment";
import { StatementType } from "./Nodes/Types/StatementType";
import { IfStatement } from "./Nodes/Statements/IfStatement";
import { CompoundStatement } from "./Nodes/Statements/CompoundStatement";
import { ASTString } from "./Nodes/Expressions/Terms/ASTString";
import { Scan } from "./Nodes/Statements/Scan";
import { Bool } from "./Nodes/Expressions/Terms/Bool";
import {FunctionDeclaration} from "./Nodes/Statements/FunctionDeclaration";
import { FunctionCallExpression } from "./Nodes/Expressions/FunctionCallExpression";
import { FunctionCallStatement } from "./Nodes/Statements/FunctionCallStatement";
import { Return } from "./Nodes/Statements/Return";

export class ASTPrinter implements ASTVisitor<void> {
    number: i32 = 0;
    tree: string[] = [];

    visitCompoundStatement(statement: CompoundStatement): void {
        statement.left.accept<void>(this);
        statement.right.accept<void>(this);
    }

    visitAssignment(statement: Assignment): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Assignment");
        this.number++;
        statement.identifier.accept<void>(this);
        statement.expression.accept<void>(this);
        this.number--;
    }

    visitWhile(statement: While): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": While");
        this.number++;
        statement.condition.accept<void>(this);
        if(statement.body !== null) {
            statement.body!.accept<void>(this);
        }
        this.number--;
    }

    visitFunctionDeclaration(statement: FunctionDeclaration): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": FunctionDeclaration");
        this.number++;
        statement.returnType.accept<void>(this);
        statement.name.accept<void>(this);
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            statement.parameters.get(key).accept<void>(this);
        }
        if(statement.body !== null) {
            statement.body.accept<void>(this);
        }
        this.number--;
    }

    visitFunctionCallExpression(expression: FunctionCallExpression): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": FunctionCallExpression " + expression.functionName);
        this.number++;
        for (let i = 0; i < expression.actualParameters.length; i++) {
            expression.actualParameters[i].accept<void>(this);
        }
        this.number--;
    }

    visitFunctionCallStatement(statement: FunctionCallStatement): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": FunctionCallStatement " + statement.functionName);
        this.number++;
        for (let i = 0; i < statement.actualParameters.length; i++) {
            statement.actualParameters[i].accept<void>(this);
        }
        this.number--;
    }

    visitPrint(param: Print): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Print");
        this.number++;
        param.expression.accept<void>(this);
        this.number--;
    }

    visitProgram(statement: Program): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Program");
        this.number++;
        if(statement.body !== null) {
            statement.body!.accept<void>(this);
        }
        this.number--;
    };

    visitBinaryExpression(expression: BinaryExpression): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": BinaryExpression " + (expression.operator !== null ? expression.operator : ""));
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right.accept<void>(this);
            this.number--;
        }
    }

    visitIdentifier(term: Identifier): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Identifier " + term.value);
    }

    visitNumber(term: Num): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Num " + term.value.toString());
    }

    visitBool(term: Bool): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Bool " + term.value);
    }

    visitString(param: ASTString): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": String " + param.value);
    }

    visitTerm(term: Term): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Term " + term.value);
    }

    visitUnaryExpression(expression: UnaryExpression): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": UnaryExpression " + (expression.operator !== null ? expression.operator : ""));
        this.number++;
        expression.primaryOrRight.accept<void>(this);
        this.number--;
    }

    private getSpace(num: i32): string {
        let space: string = "";
        for (let i: i32 = 0; i < num; i++) {
            space += " ";
        }
        return space;
    }

    visitDeclaration(statement: Declaration): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Declaration " + statement.identifier.value);
        this.number++;
        statement.type.accept<void>(this);
        this.number--;
        if (statement.expression !== null) {
            this.number++;
            statement.expression!.accept<void>(this);
            this.number--;
        }
    }

    visitValueType(type: ValueType): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ValueType " + type.type.toString());
    }

    visitStatementType(statement: StatementType): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": StatementType " + statement.type.toString());
    }

    visitIfStatement(statement: IfStatement): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": IfStatement");
        this.number++;
        statement.condition.accept<void>(this);
        if(statement.body !== null) {
            statement.body!.accept<void>(this);
        }
        if(statement.else !== null) {
            statement.else!.accept<void>(this);
        }
        this.number--;
    }

    visitScan(statement: Scan): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Scan");
        this.number++;
        statement.type.accept<void>(this);
        statement.identifier.accept<void>(this);
        this.number--;
    }

    visitReturn(statement: Return): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Return");
        this.number++;
        statement.expression.accept<void>(this);
        this.number--;
    }
}

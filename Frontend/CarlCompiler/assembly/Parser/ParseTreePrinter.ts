import {ParseUnaryExpression} from "./Expressions/ParseUnaryExpression";
import {ParseVisitor} from "./ParseVisitor";
import {ParseAdditiveExpression} from "./Expressions/ParseAdditiveExpression";
import {ParseEqualityExpression} from "./Expressions/ParseEqualityExpression";
import {ParseExpression} from "./Expressions/ParseExpression";
import {ParseMultiplicativeExpression} from "./Expressions/ParseMultiplicativeExpression";
import {ParseNum} from "./Expressions/Terms/ParseNum";
import {ParseRelationalExpression} from "./Expressions/ParseRelationalExpression";
import {ParseTerm} from "./Expressions/Terms/ParseTerm";
import {ParseIdentifier} from "./Expressions/Terms/ParseIdentifier";
import {ParsePowExpression} from "./Expressions/ParsePowExpression";
import {ParseType} from "./Expressions/Terms/ParseType";
import {ParseDeclaration} from "./Statements/ParseDeclaration";
import {ParseProgram} from "./Statements/ParseProgram";
import {ParsePrint} from "./Statements/ParsePrint";
import { ParseLoopStatement } from "./Statements/ParseLoopStatement";
import { ParseAssignment } from "./Statements/ParseAssignment";
import {ParseIfStatement} from "./Statements/ParseIfStatement";
import { ParseCompoundStatement } from "./Statements/ParseCompoundStatement";
import { ParseString } from "./Expressions/Terms/ParseString";
import { ParseScan } from "./Statements/ParseScan";
import { ParseIncrement } from "./Statements/ParseIncrement";

export class ParseTreePrinter implements ParseVisitor<void> {
    number: i32 = 0;
    tree: string[] = [];

    visitScan(statement: ParseScan): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseScan");
        this.number++;
        statement.type.accept<void>(this);
        statement.identifier.accept<void>(this);
        this.number--;
    }

    visitCompoundStatement(statement: ParseCompoundStatement): void {
        statement.left.accept<void>(this);
        statement.right.accept<void>(this);
    }

    visitAssignment(statement: ParseAssignment): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseAssignment");
        this.number++;
        statement.identifier.accept<void>(this);
        statement.expression.accept<void>(this);
        this.number--;
    }

    visitIncrement(statement: ParseIncrement): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseIncrement");
        this.number++;
        statement.identifier.accept<void>(this);
        this.number--;
    }

    visitLoopStatement(statement: ParseLoopStatement): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": While");
        this.number++;
        statement.expression.accept<void>(this);
        if(statement.body !== null) {
            statement.body.accept<void>(this);
        }
        this.number--;
    }

    visitPrint(param: ParsePrint): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParsePrint");
        this.number++;
        param.expression.accept<void>(this);
        this.number--;
    }

    visitProgram(statement: ParseProgram): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseProgram");
        this.number++;
        if(statement.body !== null) {
            statement.body!.accept<void>(this);
        }
        this.number--;
    }

    visitPowExpression(expression: ParsePowExpression): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParsePowExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
    }

    visitAdditiveExpression(expression: ParseAdditiveExpression): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseAdditiveExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
    }

    visitEqualityExpression(expression: ParseEqualityExpression): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseEqualityExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
    }

    visitExpression(expression: ParseExpression): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
    }

    visitMultiplicativeExpression(expression: ParseMultiplicativeExpression): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseMultiplicativeExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
    }

    visitNumber(term: ParseNum): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Number " + term.value.literal);
    }

    visitString(param: ParseString): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ASTString " + param.value.literal);
    }

    visitRelationalExpression(expression: ParseRelationalExpression): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseRelationalExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
    }

    visitTerm(term: ParseTerm): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseTerm " + term.value);
    }

    visitUnaryExpression(expression: ParseUnaryExpression): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseUnaryExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
        this.number++;
        expression.primaryOrRight.accept<void>(this);
        this.number--;
    }

    visitIdentifier(term: ParseIdentifier): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseIdentifier " + term.name.literal);
    }

    getSpace(num: i32): string {
        let space: string = "";
        for (let i = 0; i < num; i++) {
            space += "  ";
        }
        return space;
    }

    visitDeclaration(statement: ParseDeclaration): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseDeclaration " + statement.identifier.name.literal);
        this.number++;
        statement.type.accept<void>(this);
        this.number--;
        if (statement.expression !== null) {
            this.number++;
            statement.expression!.accept<void>(this);
            this.number--;
        }
    }

    visitType(param: ParseType): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseType " + param.name.literal);
    }

    visitIfStatement(statement: ParseIfStatement): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": If");
        this.number++;
        statement.condition.accept<void>(this);
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Then");
        this.number++;
        if(statement.body !== null) {
            statement.body!.accept<void>(this);
        }
        this.number--;
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Else");
        this.number++;
        if(statement.else !== null) {
            statement.else!.accept<void>(this);
        }
        this.number--;
        this.number--;
    }

}

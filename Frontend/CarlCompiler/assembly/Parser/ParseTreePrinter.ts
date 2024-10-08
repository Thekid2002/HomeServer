import {ParseUnaryExpression} from "./Expressions/ParseUnaryExpression";
import {ParseVisitor} from "./ParseVisitor";
import {ParseAdditiveExpression} from "./Expressions/ParseAdditiveExpression";
import {ParseEqualityExpression} from "./Expressions/ParseEqualityExpression";
import {ParseExpression} from "./Expressions/ParseExpression";
import {ParseMultiplicativeExpression} from "./Expressions/ParseMultiplicativeExpression";
import {ParseInt} from "./Expressions/Terms/ParseInt";
import {ParseRelationalExpression} from "./Expressions/ParseRelationalExpression";
import {ParseTerm} from "./Expressions/Terms/ParseTerm";
import {ParseIdentifier} from "./Expressions/Terms/ParseIdentifier";
import {ParsePowExpression} from "./Expressions/ParsePowExpression";
import {ParseType} from "./Expressions/Terms/ParseType";
import {ParseDeclaration} from "./Statements/ParseDeclaration";
import {ParseProgram} from "./Statements/ParseProgram";
import { ParseLoopStatement } from "./Statements/ParseLoopStatement";
import { ParseAssignment } from "./Statements/ParseAssignment";
import {ParseIfStatement} from "./Statements/ParseIfStatement";
import { ParseCompoundStatement } from "./Statements/ParseCompoundStatement";
import { ParseString } from "./Expressions/Terms/ParseString";
import { ParseIncrement } from "./Statements/ParseIncrement";
import { ParseBool } from "./Expressions/Terms/ParseBool";
import { ParseFunctionDeclaration } from "./Statements/ParseFunctionDeclaration";
import { ParseFunctionCallStatement } from "./Statements/ParseFunctionCallStatement";
import {ParseFunctionCallExpression} from "./Expressions/Terms/ParseFunctionCallExpression";
import { ParseReturn } from "./Statements/ParseReturn";
import { ParseImport } from "./Statements/ParseImport";
import { ParseDouble } from "./Expressions/Terms/ParseDouble";

export class ParseTreePrinter implements ParseVisitor<void> {
    number: i32 = 0;
    tree: string[] = [];

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

    visitFunction(statement: ParseFunctionDeclaration): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": FunctionObject");
        this.number++;
        statement.returnType.accept<void>(this);
        statement.name.accept<void>(this);
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            statement.parameters.get(key).accept<void>(this);
        }
        if(statement.body !== null) {
            statement.body!.accept<void>(this);
        }
        this.number--;
    }

    visitLoopStatement(statement: ParseLoopStatement): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": While");
        this.number++;
        statement.condition.accept<void>(this);
        if(statement.body !== null) {
            statement.body.accept<void>(this);
        }
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

    visitInt(term: ParseInt): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Int " + term.value.literal);
    }

    visitDouble(term: ParseDouble): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Double " + term.value.literal);
    }

    visitBool(term: ParseBool): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Bool " + term.value.literal);
    }

    visitString(param: ParseString): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ASTString " + param.value.literal);
    }

    visitReturn(statement: ParseReturn): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseReturn");
        this.number++;
        statement.expression.accept<void>(this);
        this.number--;
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
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseDeclaration " + statement.identifier.name.literal + " global: " + statement.global.toString() + " export: " + statement.export.toString());
        this.number++;
        statement.type.accept<void>(this);
        this.number--;
        if (statement.expression !== null) {
            this.number++;
            statement.expression!.accept<void>(this);
            this.number--;
        }
    }

    visitImport(statement: ParseImport): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseImport");
        this.number++;
        statement.parentPath.accept<void>(this);
        statement.childPath.accept<void>(this);
        statement.functionDeclarationWithoutBody.accept<void>(this);
        this.number--;
    }

    visitType(type: ParseType): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseType " + type.name.literal);
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

    visitFunctionCallExpression(statement: ParseFunctionCallExpression): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": FunctionCall " + statement.functionName.literal);
        this.number++;
        for (let i = 0; i < statement.actualParameters.length; i++) {
            statement.actualParameters[i].accept<void>(this);
        }
        this.number--;
    }

    visitFunctionCallStatement(statement: ParseFunctionCallStatement): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": FunctionCall " + statement.functionName.literal);
        this.number++;
        for (let i = 0; i < statement.actualParameters.length; i++) {
            statement.actualParameters[i].accept<void>(this);
        }
        this.number--;
    }

}

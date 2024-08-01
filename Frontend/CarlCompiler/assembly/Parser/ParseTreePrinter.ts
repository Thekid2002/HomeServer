import {UnaryExpression} from "./Expressions/UnaryExpression";
import {ParseVisitor} from "./ParseVisitor";
import {AdditiveExpression} from "./Expressions/AdditiveExpression";
import {EqualityExpression} from "./Expressions/EqualityExpression";
import {Expression} from "./Expressions/Expression";
import {MultiplicativeExpression} from "./Expressions/MultiplicativeExpression";
import {Num} from "./Expressions/Terms/Num";
import {RelationalExpression} from "./Expressions/RelationalExpression";
import {Term} from "./Expressions/Terms/Term";
import {Identifier} from "./Expressions/Terms/Identifier";
import {PowExpression} from "./Expressions/PowExpression";
import {Type} from "./Expressions/Terms/Type";
import {Declaration} from "./Statements/Declaration";
import {Program} from "./Statements/Program";
import {Print} from "./Statements/Print";
import { LoopStatement } from "./Statements/LoopStatement";
import { Assignment } from "./Statements/Assignment";

export class ParseTreePrinter implements ParseVisitor<void> {
    number: i32 = 0;
    tree: string[] = [];

    visitAssignment(statement: Assignment): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Assignment");
        this.number++;
        statement.identifier.accept<void>(this);
        statement.expression.accept<void>(this);
        this.number--;
    }

    visitLoopStatement(statement: LoopStatement): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": While");
        this.number++;
        statement.expression.accept<void>(this);
        for (let i = 0; i < statement.body.length; i++) {
            statement.body[i].accept<void>(this);
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
        for (let i = 0; i < statement.body.length; i++) {
            statement.body[i].accept<void>(this);
        }
    }

    visitPowExpression(expression: PowExpression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": PowExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
    }

    visitAdditiveExpression(expression: AdditiveExpression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": AdditiveExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
    }

    visitEqualityExpression(expression: EqualityExpression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": EqualityExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
    }

    visitExpression(expression: Expression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Expression " + (expression.operator !== null ? expression.operator!.literal : ""));
    }

    visitMultiplicativeExpression(expression: MultiplicativeExpression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": MultiplicativeExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
    }

    visitNumber(term: Num): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Number " + term.value.literal);
    }

    visitRelationalExpression(expression: RelationalExpression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": RelationalExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
    }

    visitTerm(term: Term): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Term " + term.value);
    }

    visitUnaryExpression(expression: UnaryExpression): void {
        this.number++;
        expression.primaryOrRight.accept<void>(this);
        this.number--;
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": UnaryExpression " + (expression.operator !== null ? expression.operator!.literal : ""));
    }

    visitIdentifier(term: Identifier): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Identifier " + term.name.literal);
    }

    getSpace(num: i32): string {
        let space: string = "";
        for (let i = 0; i < num; i++) {
            space += "  ";
        }
        return space;
    }

    visitDeclaration(statement: Declaration): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Declaration " + statement.identifier.name.literal);
        this.number++;
        statement.type.accept<void>(this);
        this.number--;
        if (statement.expression !== null) {
            this.number++;
            statement.expression!.accept<void>(this);
            this.number--;
        }
    }

    visitType(param: Type): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Type " + param.name.literal);
    }

}

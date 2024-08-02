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

export class ParseTreePrinter implements ParseVisitor<void> {
    number: i32 = 0;
    tree: string[] = [];

    visitPowExpression(expression: PowExpression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParsePowExpression " + (expression.operator !== null ? expression.operator!.literal! : ""));
    }

    visitBinaryExpression(expression: AdditiveExpression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right!.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseAdditiveExpression " + (expression.operator !== null ? expression.operator!.literal! : ""));
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
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseEqualityExpression " + (expression.operator !== null ? expression.operator!.literal! : ""));
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
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseExpression " + (expression.operator !== null ? expression.operator!.literal! : ""));
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
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseMultiplicativeExpression " + (expression.operator !== null ? expression.operator!.literal! : ""));
    }

    visitNumber(term: Num): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Number " + term.value.literal!);
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
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseRelationalExpression " + (expression.operator !== null ? expression.operator!.literal! : ""));
    }

    visitTerm(term: Term): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseTerm " + term.value);
    }

    visitUnaryExpression(expression: UnaryExpression): void {
        this.number++;
        expression.primaryOrRight.accept<void>(this);
        this.number--;
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseUnaryExpression " + (expression.operator !== null ? expression.operator!.literal! : ""));
    }

    visitIdentifier(term: Identifier): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseIdentifier " + term.name.literal!);
    }

    getSpace(num: i32): string {
        let space: string = "";
        for (let i = 0; i < num; i++) {
            space += "  ";
        }
        return space;
    }

}

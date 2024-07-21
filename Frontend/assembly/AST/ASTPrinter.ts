import {ASTVisitor} from "./ASTVisitor";
import {BinaryExpression} from "./Expressions/BinaryExpression";
import {EqualityExpression} from "./Expressions/EqualityExpression";
import {Expression} from "./Expressions/Expression";
import {Identifier} from "./Expressions/Terms/Identifier";
import {MultiplicativeExpression} from "./Expressions/MultiplicativeExpression";
import {Num} from "./Expressions/Terms/Num";
import {RelationalExpression} from "./Expressions/RelationalExpression";
import {Term} from "./Expressions/Terms/Term";
import {UnaryExpression} from "./Expressions/UnaryExpression";

export class ASTPrinter implements ASTVisitor<void> {
    number: i32 = 0;
    tree: string[] = [];

    visitBinaryExpression(expression: BinaryExpression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if(expression.right !== null) {
            this.number++;
            expression.right.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": BinaryExpression " + (expression.operator !== null ? expression.operator : ""));
    }

    visitEqualityExpression(expression: EqualityExpression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if(expression.right !== null) {
            this.number++;
            expression.right.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": EqualityExpression " + (expression.operator !== null ? expression.operator : ""));
    }

    visitExpression(expression: Expression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if(expression.right !== null) {
            this.number++;
            expression.right.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Expression " + (expression.operator !== null ? expression.operator : ""));
    }

    visitIdentifier(term: Identifier): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Identifier " + term.name);
    }

    visitMultiplicativeExpression(expression: MultiplicativeExpression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if(expression.right !== null) {
            this.number++;
            expression.right.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": MultiplicativeExpression " + (expression.operator !== null ? expression.operator : ""));
    }

    visitNumber(term: Num): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Num " + term.value.toString());
    }

    visitRelationalExpression(expression: RelationalExpression): void {
        this.number++;
        expression.primaryOrLeft.accept<void>(this);
        this.number--;
        if(expression.right !== null) {
            this.number++;
            expression.right.accept<void>(this);
            this.number--;
        }
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": RelationalExpression " + (expression.operator !== null ? expression.operator : ""));
    }

    visitTerm(term: Term): void {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Term " + term.value);
    }

    visitUnaryExpression(expression: UnaryExpression): void {
        this.number++;
        expression.primaryOrRight.accept<void>(this);
        this.number--;
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": UnaryExpression " + (expression.operator !== null ? expression.operator : ""));
    }

    private getSpace(num: i32): string {
        let space: string = "";
        for(let i: i32 = 0; i < num; i++) {
            space += " ";
        }
        return space;
    }
}

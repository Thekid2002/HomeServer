import {ASTVisitor} from "../AST/ASTVisitor";
import {BinaryExpression} from "../AST/Expressions/BinaryExpression";
import {EqualityExpression} from "../AST/Expressions/EqualityExpression";
import {Expression} from "../AST/Expressions/Expression";
import {Identifier} from "../AST/Expressions/Terms/Identifier";
import {MultiplicativeExpression} from "../AST/Expressions/MultiplicativeExpression";
import {Num} from "../AST/Expressions/Terms/Num";
import {RelationalExpression} from "../AST/Expressions/RelationalExpression";
import {Term} from "../AST/Expressions/Terms/Term";
import {UnaryExpression} from "../AST/Expressions/UnaryExpression";

export class Interpreter implements ASTVisitor<f64>{
    visitBinaryExpression(expression: BinaryExpression): f64 {
        let left = expression.primaryOrLeft.accept<f64>(this);
        let right = expression.right.accept<f64>(this);

        if(expression.operator == "+"){
            return left + right;
        }
        if(expression.operator == "-"){
            return left - right;
        }
        throw new Error("Unknown operator: " + expression.operator);
    }

    visitEqualityExpression(expression: EqualityExpression): f64 {
        let left: f64 = expression.primaryOrLeft.accept<f64>(this);
        let right: f64 = expression.right.accept<f64>(this);

        if (expression.operator == "=="){
            return left == right ? 1 : 0;
        }

        if (expression.operator == "!="){
            return left != right ? 1 : 0;
        }
        throw new Error("Unknown operator: " + expression.operator);
    }

    visitExpression(expression: Expression): f64 {
        let left: f64 = expression.primaryOrLeft.accept<f64>(this);
        let right: f64 = expression.right.accept<f64>(this);

        if (expression.operator == "&&"){
            return left && right;
        }

        if (expression.operator == "||"){
            return left || right;
        }
        throw new Error("Unknown operator: " + expression.operator);
    }

    visitIdentifier(term: Identifier): f64 {
        throw new Error("Identifiers not implemented")
    }

    visitMultiplicativeExpression(expression: MultiplicativeExpression): f64 {
        let left: f64 = expression.primaryOrLeft.accept<f64>(this);
        let right: f64 = expression.right.accept<f64>(this);

        if (expression.operator == "*"){
            return left * right;
        }
        if (expression.operator == "/"){
            return left / right;
        }
        if (expression.operator == "%"){
            return left % right;
        }

        throw new Error("Unknown operator: " + expression.operator);
    }

    visitNumber(term: Num): f64 {
        return parseFloat(term.value);
    }

    visitRelationalExpression(expression: RelationalExpression): f64 {
        let left: f64 = expression.primaryOrLeft.accept<f64>(this);
        let right: f64 = expression.right.accept<f64>(this);

        if (expression.operator == "<"){
            return left < right ? 1 : 0;
        }
        if (expression.operator == "<="){
            return left <= right ? 1 : 0;
        }
        if (expression.operator == ">"){
            return left > right ? 1 : 0;
        }
        if (expression.operator == ">="){
            return left >= right ? 1 : 0;
        }

        throw new Error("Unknown operator: " + expression.operator);
    }

    visitTerm(term: Term): f64 {
        throw new Error("" + term.value + " not implemented");
    }

    visitUnaryExpression(expression: UnaryExpression): f64 {
        let right: f64 = expression.primaryOrRight.accept<f64>(this);

        if(expression.operator == "!"){
            return right == 0 ? 1 : 0;
        }

        if(expression.operator == "-"){
            return -right;
        }

        throw new Error("Unknown operator: " + expression.operator);
    }

}

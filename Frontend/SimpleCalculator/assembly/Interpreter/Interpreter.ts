import {ASTVisitor} from "../AST/ASTVisitor";
import {BinaryExpression} from "../AST/Expressions/BinaryExpression";
import {Identifier} from "../AST/Expressions/Terms/Identifier";
import {Num} from "../AST/Expressions/Terms/Num";
import {Term} from "../AST/Expressions/Terms/Term";
import {UnaryExpression} from "../AST/Expressions/UnaryExpression";

export class Interpreter implements ASTVisitor<f64>{
    visitUnaryExpression(expression: UnaryExpression): number {
        let right = expression.primaryOrRight.accept<f64>(this);
        if(expression.operator == "!"){
            return right == 0 ? 1 : 0;
        }

        if(expression.operator == "-"){
            return -right;
        }

        if(expression.operator == "sin"){
            return Math.sin(right);
        }

        if(expression.operator == "cos"){
            return Math.cos(right);
        }

        if(expression.operator == "tan"){
            return Math.tan(right);
        }

        if(expression.operator == "sqrt"){
            return Math.sqrt(right);
        }

        if(expression.operator == "log"){
            return Math.log(right);
        }

        if(expression.operator == "asin"){
            return Math.asin(right);
        }

        if(expression.operator == "acos"){
            return Math.acos(right);
        }

        if(expression.operator == "atan"){
            return Math.atan(right);
        }

        throw new Error("Unknown operator: " + expression.operator);
    }
    visitBinaryExpression(expression: BinaryExpression): f64 {
        let left = expression.primaryOrLeft.accept<f64>(this);
        let right = expression.right.accept<f64>(this);

        if(expression.operator == "+"){
            return left + right;
        }

        if(expression.operator == "-"){
            return left - right;
        }

        if (expression.operator == "=="){
            return left == right ? 1 : 0;
        }

        if (expression.operator == "!="){
            return left != right ? 1 : 0;
        }

        if (expression.operator == "&&"){
            return left && right;
        }

        if (expression.operator == "||"){
            return left || right;
        }

        if (expression.operator == "*"){
            return left * right;
        }

        if (expression.operator == "/"){
            return left / right;
        }

        if (expression.operator == "%"){
            return left % right;
        }

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

        if (expression.operator == "^"){
            return Math.pow(left, right);
        }

        throw new Error("Unknown operator: " + expression.operator);
    }

    visitIdentifier(term: Identifier): f64 {
        throw new Error("Identifiers not implemented")
    }

    visitNumber(term: Num): f64 {
        return parseFloat(term.value);
    }

    visitTerm(term: Term): f64 {
        throw new Error("" + term.value + " not implemented");
    }
}

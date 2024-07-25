import {ASTVisitor} from "../AST/ASTVisitor";
import {UnaryExpression} from "../AST/Nodes/Expressions/UnaryExpression";
import {BinaryExpression} from "../AST/Nodes/Expressions/BinaryExpression";
import {Identifier} from "../AST/Nodes/Expressions/Terms/Identifier";
import {Num} from "../AST/Nodes/Expressions/Terms/Num";
import {Term} from "../AST/Nodes/Expressions/Terms/Term";
import {ValueType, ValueTypeEnum} from "../AST/Nodes/Types/ValueType";
import {Declaration} from "../AST/Nodes/Statements/Declaration";
import {VarEnvironment} from "./VarEnvironment";
import {ValObject} from "./Values/ValObject";
import {ValNum} from "./Values/ValNum";
import {ValBool} from "./Values/ValBool";
import {ValType} from "./Values/ValType";
import {CompoundStatement} from "../AST/Nodes/Statements/CompoundStatement";
import {Program} from "../AST/Nodes/Statements/Program";
import {Print} from "../AST/Nodes/Statements/Print";

export class Interpreter implements ASTVisitor<ValObject | null> {
    varEnv: VarEnvironment;
    prints: string[] = [];

    constructor() {
        this.varEnv = new VarEnvironment();
    }

    visitPrint(print: Print): ValObject | null {
        let value = print.expression.accept<ValObject | null>(this);
        if (value === null) {
            throw new Error("Line: " + print.lineNum.toString() + " Value is null");
        }

        this.prints.push(value.toJsonString());
        return null;
    }

    visitCompoundStatement(statement: CompoundStatement): ValObject | null {
        let left = statement.left.accept<ValObject | null>(this);
        if (left !== null) {
            return left;
        }
        let right = statement.right.accept<ValObject | null>(this);
        return right;
    }

    visitProgram(statement: Program): ValObject | null {
        return statement.statement.accept<ValObject | null>(this);
    }

    visitUnaryExpression(expression: UnaryExpression): ValObject | null {
        let right = expression.primaryOrRight.accept<ValObject | null>(this);
        if (expression.operator == "!") {
            return new ValBool(!(right as ValBool).value);
        }

        if (expression.operator == "-") {
            return new ValNum(-(right as ValNum).value);
        }

        if (expression.operator == "sin") {
            return new ValNum(Math.sin((right as ValNum).value));
        }

        if (expression.operator == "cos") {
            return new ValNum(Math.cos((right as ValNum).value));
        }

        if (expression.operator == "tan") {
            return new ValNum(Math.tan((right as ValNum).value));
        }

        if (expression.operator == "sqrt") {
            return new ValNum(Math.sqrt((right as ValNum).value));
        }

        if (expression.operator == "log") {
            return new ValNum(Math.log((right as ValNum).value));
        }

        if (expression.operator == "asin") {
            return new ValNum(Math.asin((right as ValNum).value));
        }

        if (expression.operator == "acos") {
            return new ValNum(Math.acos((right as ValNum).value));
        }

        if (expression.operator == "atan") {
            return new ValNum(Math.atan((right as ValNum).value));
        }

        throw new Error("Unknown operator: " + expression.operator);
    }

    visitBinaryExpression(expression: BinaryExpression): ValObject | null {
        let left = expression.primaryOrLeft.accept<ValObject | null>(this);
        let right = expression.right.accept<ValObject | null>(this);

        if (expression.operator == "+") {
            return new ValNum((left as ValNum).value + (right as ValNum).value);
        }

        if (expression.operator == "-") {
            return new ValNum((left as ValNum).value - (right as ValNum).value);
        }

        if (expression.operator == "==") {
            if (left instanceof ValNum && right instanceof ValNum) {
                return new ValBool((left as ValNum).value == (right as ValNum).value);
            }

            if (left instanceof ValBool && right instanceof ValBool) {
                return new ValBool((left as ValBool).value == (right as ValBool).value);
            }
        }

        if (expression.operator == "!=") {
            if (left instanceof ValNum && right instanceof ValNum) {
                return new ValBool((left as ValNum).value != (right as ValNum).value);
            }
            if (left instanceof ValBool && right instanceof ValBool) {
                return new ValBool((left as ValBool).value != (right as ValBool).value);
            }
        }

        if (expression.operator == "&&") {
            return new ValBool((left as ValBool).value && (right as ValBool).value);
        }

        if (expression.operator == "||") {
            return new ValBool((left as ValBool).value || (right as ValBool).value);
        }

        if (expression.operator == "*") {
            return new ValNum((left as ValNum).value * (right as ValNum).value);
        }

        if (expression.operator == "/") {
            return new ValNum((left as ValNum).value / (right as ValNum).value);
        }

        if (expression.operator == "%") {
            return new ValNum((left as ValNum).value % (right as ValNum).value);
        }

        if (expression.operator == "<") {
            return new ValBool((left as ValNum).value < (right as ValNum).value);
        }

        if (expression.operator == "<=") {
            return new ValBool((left as ValNum).value <= (right as ValNum).value);
        }

        if (expression.operator == ">") {
            return new ValBool((left as ValNum).value > (right as ValNum).value);
        }

        if (expression.operator == ">=") {
            return new ValBool((left as ValNum).value >= (right as ValNum).value);
        }

        if (expression.operator == "^") {
            return new ValNum(Math.pow((left as ValNum).value, (right as ValNum).value));
        }

        throw new Error("Unknown operator: " + expression.operator);
    }

    visitIdentifier(term: Identifier): ValObject | null {
        return this.varEnv.lookUp(term.name);
    }

    visitNumber(term: Num): ValObject | null {
        return new ValNum(parseFloat(term.value));
    }

    visitTerm(term: Term): ValObject | null {
        throw new Error("" + term.value + " not implemented");
    }

    visitDeclaration(statement: Declaration): ValObject | null {
        let type = statement.type;
        let identifier = statement.identifier;
        if (this.varEnv.lookUp(identifier.name) != null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Variable " + identifier.name + " already declared");
        }

        let value: ValObject | null = null;
        if (statement.expression !== null) {
            value = statement.expression!.accept<ValObject | null>(this);
        }

        this.varEnv.addVar(identifier.name, value);
        return null;
    }

    visitValueType(type: ValueType): ValObject | null {
        return new ValType(type);

    }
}

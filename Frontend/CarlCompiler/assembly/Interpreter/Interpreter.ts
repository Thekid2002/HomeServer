import {ASTVisitor} from "../AST/ASTVisitor";
import {ValObject} from "../Env/Values/ValObject";
import {VarEnvironment} from "../Env/VarEnvironment";
import {StatementType} from "../AST/Nodes/Types/StatementType";
import {Assignment} from "../AST/Nodes/Statements/Assignment";
import {While} from "../AST/Nodes/Statements/While";
import {ValBool} from "../Env/Values/ValBool";
import {Print} from "../AST/Nodes/Statements/Print";
import {Program} from "../AST/Nodes/Statements/Program";
import {UnaryExpression} from "../AST/Nodes/Expressions/UnaryExpression";
import {ValNum} from "../Env/Values/ValNum";
import {BinaryExpression} from "../AST/Nodes/Expressions/BinaryExpression";
import {Identifier} from "../AST/Nodes/Expressions/Terms/Identifier";
import {Num} from "../AST/Nodes/Expressions/Terms/Num";
import {Term} from "../AST/Nodes/Expressions/Terms/Term";
import {Declaration} from "../AST/Nodes/Statements/Declaration";
import {ValueType} from "../AST/Nodes/Types/ValueType";
import {ValType} from "../Env/Values/ValType";
import { IfStatement } from "../AST/Nodes/Statements/IfStatement";
import {CompoundStatement} from "../AST/Nodes/Statements/CompoundStatement";
import { ASTString } from "../AST/Nodes/Expressions/Terms/ASTString";
import {ValString} from "../Env/Values/ValString";


export class Interpreter implements ASTVisitor<ValObject | null> {
    varEnv: VarEnvironment;
    prints: string[] = [];

    constructor() {
        this.varEnv = new VarEnvironment();
    }

    visitString(param: ASTString): ValObject | null {
        return new ValString(param.value);
    }

    visitIfStatement(statement: IfStatement): ValObject | null {
        let condition = statement.condition.accept<ValObject | null>(this);
        if (condition === null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
        }

        if ((condition as ValBool).value) {
            if (statement.body !== null) {
                statement.body!.accept<ValObject | null>(this);
            }
        } else {
            if (statement.else !== null) {
                statement.else!.accept<ValObject | null>(this);
            }
        }

        return null;
    }

    visitStatementType(statement: StatementType): ValObject | null {
        throw new Error("Method not implemented.");
    }

    visitAssignment(statement: Assignment): ValObject | null {
        let value = statement.expression.accept<ValObject | null>(this);
        if (value === null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
        }

        let prevVal = this.varEnv.lookUp(statement.identifier.name);
        if (prevVal === null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Variable " + statement.identifier.name + " not declared");
        }

        this.varEnv.setVar(statement.identifier.name, value);
        return null;
    }

    visitWhile(statement: While): ValObject | null {
        if(statement.declaration !== null) {
            statement.declaration!.accept<ValObject | null>(this);
        }
        let expression = statement.condition.accept<ValObject | null>(this);
        if (expression === null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
        }

        while ((expression as ValBool).value) {
            if (statement.body !== null) {
                statement.body!.accept<ValObject | null>(this);
            }
            expression = statement.condition.accept<ValObject | null>(this);
            if (expression === null) {
                throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
            }
        }

        return null;
    }

    visitPrint(print: Print): ValObject | null {
        let value = print.expression.accept<ValObject | null>(this);
        if (value === null) {
            throw new Error("Line: " + print.lineNum.toString() + " Value is null");
        }

        this.prints.push(value.toJsonString());
        return null;
    }

    visitProgram(statement: Program): ValObject | null {
        if (statement.body !== null) {
            statement.body!.accept<ValObject | null>(this);
        }
        return null;
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
        if (left === null || right === null) {
            throw new Error("Line: " + expression.lineNum.toString() + " Value is null");
        }

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
        let val = this.varEnv.lookUp(term.name);
        if (val === null) {
            throw new Error("Line: " + term.lineNum.toString() + " Variable " + term.name + " not declared");
        }
        return val;
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

    visitCompoundStatement(statement: CompoundStatement): ValObject | null {
        statement.left.accept<ValObject | null>(this);
        statement.right.accept<ValObject | null>(this);
        return null;
    }
}

import {ValObject} from "../Env/Values/ValObject";
import {StatementType} from "../AST/Nodes/Types/StatementType";
import {Assignment} from "../AST/Nodes/Statements/Assignment";
import {While} from "../AST/Nodes/Statements/While";
import {ValBool} from "../Env/Values/ValBool";
import {Program} from "../AST/Nodes/Statements/Program";
import {UnaryExpression} from "../AST/Nodes/Expressions/UnaryExpression";
import {BinaryExpression} from "../AST/Nodes/Expressions/BinaryExpression";
import {Identifier} from "../AST/Nodes/Expressions/Terms/Identifier";
import {Int} from "../AST/Nodes/Expressions/Terms/Int";
import {Declaration} from "../AST/Nodes/Statements/Declaration";
import { IfStatement } from "../AST/Nodes/Statements/IfStatement";
import {CompoundStatement} from "../AST/Nodes/Statements/CompoundStatement";
import { ASTString } from "../AST/Nodes/Expressions/Terms/ASTString";
import {ValString} from "../Env/Values/ValString";
import {VarEnv} from "../Env/VarEnv";
import { Bool } from "../AST/Nodes/Expressions/Terms/Bool";
import {AbstractStatement} from "../AST/Nodes/Statements/AbstractStatement";
import {AbstractExpression} from "../AST/Nodes/Expressions/AbstractExpression";
import {ValDouble} from "../Env/Values/ValDouble";


export class Interpreter{
    varEnv: VarEnv;
    prints: string[] = [];

    constructor(varEnv: VarEnv) {
        this.varEnv = varEnv;
    }

    evaluateBool(term: Bool): ValObject | null {
        return new ValBool(term.value === "true");
    }

    evaluateString(param: ASTString): ValObject | null {
        return new ValString(param.value);
    }

    evaluateIfStatement(statement: IfStatement): ValObject | null {
        let condition = this.evaluateExpression(statement.condition);
        if (condition === null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
        }

        if ((condition as ValBool).value) {
            if (statement.body !== null) {
                statement.body!;
            }
        } else {
            if (statement.else !== null) {
                statement.else!;
            }
        }

        return null;
    }

    evaluateAssignment(statement: Assignment): ValObject | null {
        let value = this.evaluateExpression(statement.expression);
        if (value === null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
        }

        let prevVal = this.varEnv.lookUpValue(statement.identifier.value);
        if (prevVal === null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Variable " + statement.identifier.value + " not declared");
        }

        this.varEnv.setVarVal(statement.identifier.value, value);
        return null;
    }

    evaluateWhile(statement: While): ValObject | null {
        if(statement.initiator !== null) {
            statement.initiator!;
        }
        let expression = this.evaluateExpression(statement.condition);
        if (expression === null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
        }

        while ((expression as ValBool).value) {
            if (statement.body !== null) {
                statement.body!;
            }
            expression = this.evaluateExpression(statement.condition);
            if (expression === null) {
                throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
            }
        }

        return null;
    }

    evaluateUnaryExpression(expression: UnaryExpression): ValObject | null {
        let right = this.evaluateExpression(expression.primaryOrRight);
        if (expression.operator == "!") {
            return new ValBool(!(right as ValBool).value);
        }

        if (expression.operator == "-") {
            return new ValDouble(-(right as ValDouble).value);
        }

        if (expression.operator == "sin") {
            return new ValDouble(Math.sin((right as ValDouble).value));
        }

        if (expression.operator == "cos") {
            return new ValDouble(Math.cos((right as ValDouble).value));
        }

        if (expression.operator == "tan") {
            return new ValDouble(Math.tan((right as ValDouble).value));
        }

        if (expression.operator == "sqrt") {
            return new ValDouble(Math.sqrt((right as ValDouble).value));
        }

        if (expression.operator == "log") {
            return new ValDouble(Math.log((right as ValDouble).value));
        }

        if (expression.operator == "asin") {
            return new ValDouble(Math.asin((right as ValDouble).value));
        }

        if (expression.operator == "acos") {
            return new ValDouble(Math.acos((right as ValDouble).value));
        }

        if (expression.operator == "atan") {
            return new ValDouble(Math.atan((right as ValDouble).value));
        }

        throw new Error("Unknown operator: " + expression.operator);
    }

    evaluateBinaryExpression(expression: BinaryExpression): ValObject | null {
        let left = this.evaluateExpression(expression.primaryOrLeft);
        let right = this.evaluateExpression(expression.right);
        if (left === null || right === null) {
            throw new Error("Line: " + expression.lineNum.toString() + " Value is null");
        }

        if (expression.operator == "+") {
            return new ValDouble((left as ValDouble).value + (right as ValDouble).value);
        }

        if (expression.operator == "-") {
            return new ValDouble((left as ValDouble).value - (right as ValDouble).value);
        }

        if (expression.operator == "==") {
            if (left instanceof ValDouble && right instanceof ValDouble) {
                return new ValBool((left as ValDouble).value == (right as ValDouble).value);
            }

            if (left instanceof ValBool && right instanceof ValBool) {
                return new ValBool((left as ValBool).value == (right as ValBool).value);
            }
        }

        if (expression.operator == "!=") {
            if (left instanceof ValDouble && right instanceof ValDouble) {
                return new ValBool((left as ValDouble).value != (right as ValDouble).value);
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
            return new ValDouble((left as ValDouble).value * (right as ValDouble).value);
        }

        if (expression.operator == "/") {
            return new ValDouble((left as ValDouble).value / (right as ValDouble).value);
        }

        if (expression.operator == "%") {
            return new ValDouble((left as ValDouble).value % (right as ValDouble).value);
        }

        if (expression.operator == "<") {
            return new ValBool((left as ValDouble).value < (right as ValDouble).value);
        }

        if (expression.operator == "<=") {
            return new ValBool((left as ValDouble).value <= (right as ValDouble).value);
        }

        if (expression.operator == ">") {
            return new ValBool((left as ValDouble).value > (right as ValDouble).value);
        }

        if (expression.operator == ">=") {
            return new ValBool((left as ValDouble).value >= (right as ValDouble).value);
        }

        if (expression.operator == "^") {
            return new ValDouble(Math.pow((left as ValDouble).value, (right as ValDouble).value));
        }

        throw new Error("Unknown operator: " + expression.operator);
    }

    evaluateIdentifier(term: Identifier): ValObject | null {
        let val = this.varEnv.lookUpValue(term.value);
        if (val === null) {
            throw new Error("Line: " + term.lineNum.toString() + " Variable " + term.value + " not declared");
        }
        return val;
    }

    evaluateNumber(term: Int): ValObject | null {
        return new ValDouble(parseFloat(term.value));
    }

    evaluateExpression(expression: AbstractExpression): ValObject | null {
        if(expression instanceof BinaryExpression) {
            return this.evaluateBinaryExpression(expression as BinaryExpression);
        }

        if(expression instanceof UnaryExpression) {
            return this.evaluateUnaryExpression(expression as UnaryExpression);
        }

        if(expression instanceof Identifier) {
            return this.evaluateIdentifier(expression as Identifier);
        }

        if(expression instanceof Int) {
            return this.evaluateNumber(expression as Int);
        }

        if(expression instanceof Bool) {
            return this.evaluateBool(expression as Bool);
        }

        if(expression instanceof ASTString) {
            return this.evaluateString(expression as ASTString);
        }

        throw new Error("Expression not implemented");
    }

    evaluateProgram(program: Program): ValObject | null {
        if(program.body !== null) {
            this.evaluateStatement(program.body!);
        }
        return null;
    }

    evaluateStatement(statement: AbstractStatement): ValObject | null {
        if(statement instanceof Assignment) {
            return this.evaluateAssignment(statement as Assignment);
        }

        if(statement instanceof Declaration) {
            return this.evaluateDeclaration(statement as Declaration);
        }

        if(statement instanceof Program) {
            return this.evaluateProgram(statement as Program);
        }

        if(statement instanceof While) {
            return this.evaluateWhile(statement as While);
        }

        if(statement instanceof IfStatement) {
            return this.evaluateIfStatement(statement as IfStatement);
        }

        if(statement instanceof CompoundStatement) {
            return this.evaluateCompoundStatement(statement as CompoundStatement);
        }

        throw new Error("Statement not implemented");

    }

    evaluateDeclaration(statement: Declaration): ValObject | null {
        let identifier = statement.identifier;
        if (this.varEnv.lookUpValue(identifier.value) != null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Variable " + identifier.value + " already declared");
        }

        let value: ValObject | null = null;
        if (statement.expression !== null) {
            value = this.evaluateExpression(statement.expression!);
            this.varEnv.setVarVal(identifier.value, value!);
        }

        return null;
    }

    evaluateCompoundStatement(statement: CompoundStatement): ValObject | null {
        this.evaluateStatement(statement.left);
        this.evaluateStatement(statement.right);
        return null;
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const Assignment_1 = require("../AST/Nodes/Statements/Assignment");
const While_1 = require("../AST/Nodes/Statements/While");
const ValBool_1 = require("../Env/Values/ValBool");
const Program_1 = require("../AST/Nodes/Statements/Program");
const UnaryExpression_1 = require("../AST/Nodes/Expressions/UnaryExpression");
const BinaryExpression_1 = require("../AST/Nodes/Expressions/BinaryExpression");
const Identifier_1 = require("../AST/Nodes/Expressions/Terms/Identifier");
const Int_1 = require("../AST/Nodes/Expressions/Terms/Int");
const Declaration_1 = require("../AST/Nodes/Statements/Declaration");
const IfStatement_1 = require("../AST/Nodes/Statements/IfStatement");
const CompoundStatement_1 = require("../AST/Nodes/Statements/CompoundStatement");
const ASTString_1 = require("../AST/Nodes/Expressions/Terms/ASTString");
const ValString_1 = require("../Env/Values/ValString");
const Bool_1 = require("../AST/Nodes/Expressions/Terms/Bool");
const ValDouble_1 = require("../Env/Values/ValDouble");
class Interpreter {
    constructor(varEnv) {
        this.prints = [];
        this.varEnv = varEnv;
    }
    evaluateBool(term) {
        return new ValBool_1.ValBool(term.value === "true");
    }
    evaluateString(param) {
        return new ValString_1.ValString(param.value);
    }
    evaluateIfStatement(statement) {
        let condition = this.evaluateExpression(statement.condition);
        if (condition === null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
        }
        if (condition.value) {
            if (statement.body !== null) {
                statement.body;
            }
        }
        else {
            if (statement.else !== null) {
                statement.else;
            }
        }
        return null;
    }
    evaluateAssignment(statement) {
        let value = this.evaluateExpression(statement.expression);
        if (value === null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
        }
        let prevVal = this.varEnv.lookUpValue(statement.identifier.value);
        if (prevVal === null) {
            throw new Error("Line: " +
                statement.lineNum.toString() +
                " Variable " +
                statement.identifier.value +
                " not declared");
        }
        this.varEnv.setVarVal(statement.identifier.value, value);
        return null;
    }
    evaluateWhile(statement) {
        if (statement.initiator !== null) {
            statement.initiator;
        }
        let expression = this.evaluateExpression(statement.condition);
        if (expression === null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
        }
        while (expression.value) {
            if (statement.body !== null) {
                statement.body;
            }
            expression = this.evaluateExpression(statement.condition);
            if (expression === null) {
                throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
            }
        }
        return null;
    }
    evaluateUnaryExpression(expression) {
        let right = this.evaluateExpression(expression.primaryOrRight);
        if (expression.operator == "!") {
            return new ValBool_1.ValBool(!right.value);
        }
        if (expression.operator == "-") {
            return new ValDouble_1.ValDouble(-right.value);
        }
        if (expression.operator == "sin") {
            return new ValDouble_1.ValDouble(Math.sin(right.value));
        }
        if (expression.operator == "cos") {
            return new ValDouble_1.ValDouble(Math.cos(right.value));
        }
        if (expression.operator == "tan") {
            return new ValDouble_1.ValDouble(Math.tan(right.value));
        }
        if (expression.operator == "sqrt") {
            return new ValDouble_1.ValDouble(Math.sqrt(right.value));
        }
        if (expression.operator == "log") {
            return new ValDouble_1.ValDouble(Math.log(right.value));
        }
        if (expression.operator == "asin") {
            return new ValDouble_1.ValDouble(Math.asin(right.value));
        }
        if (expression.operator == "acos") {
            return new ValDouble_1.ValDouble(Math.acos(right.value));
        }
        if (expression.operator == "atan") {
            return new ValDouble_1.ValDouble(Math.atan(right.value));
        }
        throw new Error("Unknown operator: " + expression.operator);
    }
    evaluateBinaryExpression(expression) {
        let left = this.evaluateExpression(expression.primaryOrLeft);
        let right = this.evaluateExpression(expression.right);
        if (left === null || right === null) {
            throw new Error("Line: " + expression.lineNum.toString() + " Value is null");
        }
        if (expression.operator == "+") {
            return new ValDouble_1.ValDouble(left.value + right.value);
        }
        if (expression.operator == "-") {
            return new ValDouble_1.ValDouble(left.value - right.value);
        }
        if (expression.operator == "==") {
            if (left instanceof ValDouble_1.ValDouble && right instanceof ValDouble_1.ValDouble) {
                return new ValBool_1.ValBool(left.value == right.value);
            }
            if (left instanceof ValBool_1.ValBool && right instanceof ValBool_1.ValBool) {
                return new ValBool_1.ValBool(left.value == right.value);
            }
        }
        if (expression.operator == "!=") {
            if (left instanceof ValDouble_1.ValDouble && right instanceof ValDouble_1.ValDouble) {
                return new ValBool_1.ValBool(left.value != right.value);
            }
            if (left instanceof ValBool_1.ValBool && right instanceof ValBool_1.ValBool) {
                return new ValBool_1.ValBool(left.value != right.value);
            }
        }
        if (expression.operator == "&&") {
            return new ValBool_1.ValBool(left.value && right.value);
        }
        if (expression.operator == "||") {
            return new ValBool_1.ValBool(left.value || right.value);
        }
        if (expression.operator == "*") {
            return new ValDouble_1.ValDouble(left.value * right.value);
        }
        if (expression.operator == "/") {
            return new ValDouble_1.ValDouble(left.value / right.value);
        }
        if (expression.operator == "%") {
            return new ValDouble_1.ValDouble(left.value % right.value);
        }
        if (expression.operator == "<") {
            return new ValBool_1.ValBool(left.value < right.value);
        }
        if (expression.operator == "<=") {
            return new ValBool_1.ValBool(left.value <= right.value);
        }
        if (expression.operator == ">") {
            return new ValBool_1.ValBool(left.value > right.value);
        }
        if (expression.operator == ">=") {
            return new ValBool_1.ValBool(left.value >= right.value);
        }
        if (expression.operator == "^") {
            return new ValDouble_1.ValDouble(Math.pow(left.value, right.value));
        }
        throw new Error("Unknown operator: " + expression.operator);
    }
    evaluateIdentifier(term) {
        let val = this.varEnv.lookUpValue(term.value);
        if (val === null) {
            throw new Error("Line: " +
                term.lineNum.toString() +
                " Variable " +
                term.value +
                " not declared");
        }
        return val;
    }
    evaluateNumber(term) {
        return new ValDouble_1.ValDouble(parseFloat(term.value));
    }
    evaluateExpression(expression) {
        if (expression instanceof BinaryExpression_1.BinaryExpression) {
            return this.evaluateBinaryExpression(expression);
        }
        if (expression instanceof UnaryExpression_1.UnaryExpression) {
            return this.evaluateUnaryExpression(expression);
        }
        if (expression instanceof Identifier_1.Identifier) {
            return this.evaluateIdentifier(expression);
        }
        if (expression instanceof Int_1.Int) {
            return this.evaluateNumber(expression);
        }
        if (expression instanceof Bool_1.Bool) {
            return this.evaluateBool(expression);
        }
        if (expression instanceof ASTString_1.ASTString) {
            return this.evaluateString(expression);
        }
        throw new Error("Expression not implemented");
    }
    evaluateProgram(program) {
        if (program.body !== null) {
            this.evaluateStatement(program.body);
        }
        return null;
    }
    evaluateStatement(statement) {
        if (statement instanceof Assignment_1.Assignment) {
            return this.evaluateAssignment(statement);
        }
        if (statement instanceof Declaration_1.Declaration) {
            return this.evaluateDeclaration(statement);
        }
        if (statement instanceof Program_1.Program) {
            return this.evaluateProgram(statement);
        }
        if (statement instanceof While_1.While) {
            return this.evaluateWhile(statement);
        }
        if (statement instanceof IfStatement_1.IfStatement) {
            return this.evaluateIfStatement(statement);
        }
        if (statement instanceof CompoundStatement_1.CompoundStatement) {
            return this.evaluateCompoundStatement(statement);
        }
        throw new Error("Statement not implemented");
    }
    evaluateDeclaration(statement) {
        let identifier = statement.identifier;
        if (this.varEnv.lookUpValue(identifier.value) != null) {
            throw new Error("Line: " +
                statement.lineNum.toString() +
                " Variable " +
                identifier.value +
                " already declared");
        }
        let value = null;
        if (statement.expression !== null) {
            value = this.evaluateExpression(statement.expression);
            this.varEnv.setVarVal(identifier.value, value);
        }
        return null;
    }
    evaluateCompoundStatement(statement) {
        this.evaluateStatement(statement.left);
        this.evaluateStatement(statement.right);
        return null;
    }
}
exports.Interpreter = Interpreter;

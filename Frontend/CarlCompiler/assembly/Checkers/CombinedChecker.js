"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinedChecker = void 0;
const BinaryExpression_1 = require("../AST/Nodes/Expressions/BinaryExpression");
const Identifier_1 = require("../AST/Nodes/Expressions/Terms/Identifier");
const Int_1 = require("../AST/Nodes/Expressions/Terms/Int");
const UnaryExpression_1 = require("../AST/Nodes/Expressions/UnaryExpression");
const Assignment_1 = require("../AST/Nodes/Statements/Assignment");
const Declaration_1 = require("../AST/Nodes/Statements/Declaration");
const While_1 = require("../AST/Nodes/Statements/While");
const ValueType_1 = require("../AST/Nodes/Types/ValueType");
const StatementType_1 = require("../AST/Nodes/Types/StatementType");
const IfStatement_1 = require("../AST/Nodes/Statements/IfStatement");
const CompoundStatement_1 = require("../AST/Nodes/Statements/CompoundStatement");
const ASTString_1 = require("../AST/Nodes/Expressions/Terms/ASTString");
const Bool_1 = require("../AST/Nodes/Expressions/Terms/Bool");
const FunctionDeclaration_1 = require("../AST/Nodes/Statements/FunctionDeclaration");
const FunctionCallStatement_1 = require("../AST/Nodes/Statements/FunctionCallStatement");
const FunctionCallExpression_1 = require("../AST/Nodes/Expressions/FunctionCallExpression");
const Return_1 = require("../AST/Nodes/Statements/Return");
const ImportFunction_1 = require("../AST/Nodes/Statements/ImportFunction");
const Double_1 = require("../AST/Nodes/Expressions/Terms/Double");
class CombinedChecker {
    constructor() {
        this.errors = [];
    }
    checkProgram(statement, varEnv, funcEnv, currentReturnType = null) {
        if (statement.body !== null) {
            this.checkStatement(statement.body, varEnv, funcEnv, currentReturnType);
        }
        statement.varEnv = varEnv;
        return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.PROGRAM, statement.lineNum);
    }
    checkStatement(statement, varEnv, funcEnv, currentReturnType) {
        if (statement instanceof Declaration_1.Declaration) {
            return this.checkDeclaration(statement, varEnv, funcEnv);
        }
        if (statement instanceof Assignment_1.Assignment) {
            return this.checkAssignment(statement, varEnv, funcEnv);
        }
        if (statement instanceof While_1.While) {
            return this.checkWhile(statement, varEnv, funcEnv, currentReturnType);
        }
        if (statement instanceof ImportFunction_1.ImportFunction) {
            return this.checkImport(statement, varEnv, funcEnv);
        }
        if (statement instanceof IfStatement_1.IfStatement) {
            return this.checkIfStatement(statement, varEnv, funcEnv, currentReturnType);
        }
        if (statement instanceof CompoundStatement_1.CompoundStatement) {
            return this.checkCompoundStatement(statement, varEnv, funcEnv, currentReturnType);
        }
        if (statement instanceof FunctionDeclaration_1.FunctionDeclaration) {
            return this.checkFunctionDeclaration(statement, varEnv, funcEnv);
        }
        if (statement instanceof FunctionCallStatement_1.FunctionCallStatement) {
            return this.checkFunctionCallStatement(statement, varEnv, funcEnv);
        }
        if (statement instanceof Return_1.Return) {
            return this.checkReturnStatement(statement, varEnv, funcEnv, currentReturnType);
        }
        this.errors.push("Line: " + statement.lineNum.toString() + " Statement not supported");
        return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.ERROR, statement.lineNum);
    }
    checkCompoundStatement(statement, varEnv, funcEnv, currentReturnType) {
        let left = this.checkStatement(statement.left, varEnv, funcEnv, currentReturnType);
        let right = this.checkStatement(statement.right, varEnv, funcEnv, currentReturnType);
        return left;
    }
    checkExpression(expression, varEnv, funcEnv) {
        if (expression instanceof BinaryExpression_1.BinaryExpression) {
            return this.checkBinaryExpression(expression, varEnv, funcEnv);
        }
        if (expression instanceof UnaryExpression_1.UnaryExpression) {
            return this.checkUnaryExpression(expression, varEnv, funcEnv);
        }
        if (expression instanceof Double_1.Double) {
            return this.checkDouble(expression, varEnv, funcEnv);
        }
        if (expression instanceof Int_1.Int) {
            return this.checkInt(expression, varEnv, funcEnv);
        }
        if (expression instanceof Bool_1.Bool) {
            return this.checkBool(expression, varEnv, funcEnv);
        }
        if (expression instanceof ASTString_1.ASTString) {
            return this.checkString(expression, varEnv, funcEnv);
        }
        if (expression instanceof Identifier_1.Identifier) {
            return this.checkIdentifier(expression, varEnv, funcEnv);
        }
        if (expression instanceof FunctionCallExpression_1.FunctionCallExpression) {
            return this.checkFunctionCallExpression(expression, varEnv, funcEnv);
        }
        this.errors.push("Line: " + expression.lineNum.toString() + " Expression not supported");
        return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
    }
    checkBinaryExpression(expression, varEnv, funcEnv) {
        let left = this.checkExpression(expression.primaryOrLeft, varEnv, funcEnv);
        let right = this.checkExpression(expression.right, varEnv, funcEnv);
        if (expression.operator === "+") {
            if ((left.type === ValueType_1.ValueTypeEnum.STRING &&
                (right.type === ValueType_1.ValueTypeEnum.STRING ||
                    right.type === ValueType_1.ValueTypeEnum.DOUBLE ||
                    right.type === ValueType_1.ValueTypeEnum.BOOL ||
                    right.type === ValueType_1.ValueTypeEnum.INT)) ||
                (right.type === ValueType_1.ValueTypeEnum.STRING &&
                    (left.type === ValueType_1.ValueTypeEnum.STRING ||
                        left.type === ValueType_1.ValueTypeEnum.DOUBLE ||
                        left.type === ValueType_1.ValueTypeEnum.BOOL ||
                        left.type === ValueType_1.ValueTypeEnum.INT))) {
                expression.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.STRING, expression.lineNum);
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.STRING, expression.lineNum);
            }
            if ((left.type === ValueType_1.ValueTypeEnum.DOUBLE &&
                right.type === ValueType_1.ValueTypeEnum.DOUBLE) ||
                (right.type === ValueType_1.ValueTypeEnum.DOUBLE &&
                    left.type === ValueType_1.ValueTypeEnum.INT) ||
                (right.type === ValueType_1.ValueTypeEnum.INT && left.type === ValueType_1.ValueTypeEnum.DOUBLE)) {
                expression.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.DOUBLE, expression.lineNum);
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.DOUBLE, expression.lineNum);
            }
            if (left.type === ValueType_1.ValueTypeEnum.INT && right.type === ValueType_1.ValueTypeEnum.INT) {
                expression.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.INT, expression.lineNum);
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.INT, expression.lineNum);
            }
            this.errors.push("Line: " +
                expression.lineNum.toString() +
                " Expected type: " +
                ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.DOUBLE] +
                " or " +
                ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.STRING] +
                " but got: " +
                ValueType_1.ValueTypeNames[left.type]);
            return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
        }
        if (expression.operator === "-" ||
            expression.operator === "*" ||
            expression.operator === "/" ||
            expression.operator === "%") {
            if ((left.type === ValueType_1.ValueTypeEnum.DOUBLE &&
                right.type === ValueType_1.ValueTypeEnum.DOUBLE) ||
                (right.type === ValueType_1.ValueTypeEnum.DOUBLE &&
                    left.type === ValueType_1.ValueTypeEnum.INT) ||
                (right.type === ValueType_1.ValueTypeEnum.INT && left.type === ValueType_1.ValueTypeEnum.DOUBLE)) {
                expression.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.DOUBLE, expression.lineNum);
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.DOUBLE, expression.lineNum);
            }
            if (left.type === ValueType_1.ValueTypeEnum.INT && right.type === ValueType_1.ValueTypeEnum.INT) {
                expression.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.INT, expression.lineNum);
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.INT, expression.lineNum);
            }
            this.errors.push("Line: " +
                expression.lineNum.toString() +
                " Expected type: " +
                ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.DOUBLE] +
                " but got: " +
                ValueType_1.ValueTypeNames[left.type]);
            return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
        }
        if (expression.operator === "==" || expression.operator === "!=") {
            if ((right.type === ValueType_1.ValueTypeEnum.DOUBLE &&
                left.type === ValueType_1.ValueTypeEnum.INT) ||
                (right.type === ValueType_1.ValueTypeEnum.INT && left.type === ValueType_1.ValueTypeEnum.DOUBLE)) {
                expression.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.DOUBLE, expression.lineNum);
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.BOOL, expression.lineNum);
            }
            else if (left.type !== right.type) {
                this.errors.push("Line: " +
                    expression.lineNum.toString() +
                    " Expected type: " +
                    ValueType_1.ValueTypeNames[left.type] +
                    " but got: " +
                    ValueType_1.ValueTypeNames[right.type]);
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
            }
            expression.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.BOOL, expression.lineNum);
            return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.BOOL, expression.lineNum);
        }
        if (expression.operator === ">" ||
            expression.operator === "<" ||
            expression.operator === ">=" ||
            expression.operator === "<=") {
            if ((right.type === ValueType_1.ValueTypeEnum.DOUBLE &&
                left.type === ValueType_1.ValueTypeEnum.DOUBLE) ||
                (right.type === ValueType_1.ValueTypeEnum.DOUBLE &&
                    left.type === ValueType_1.ValueTypeEnum.INT) ||
                (right.type === ValueType_1.ValueTypeEnum.INT && left.type === ValueType_1.ValueTypeEnum.DOUBLE)) {
                expression.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.DOUBLE, expression.lineNum);
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.BOOL, expression.lineNum);
            }
            if (left.type === ValueType_1.ValueTypeEnum.INT && right.type === ValueType_1.ValueTypeEnum.INT) {
                expression.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.INT, expression.lineNum);
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.BOOL, expression.lineNum);
            }
            this.errors.push("Line: " +
                expression.lineNum.toString() +
                " Expected type: " +
                ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.DOUBLE] +
                " but got: " +
                ValueType_1.ValueTypeNames[left.type]);
            return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
        }
        if (expression.operator === "&&" || expression.operator === "||") {
            if (left.type !== ValueType_1.ValueTypeEnum.BOOL ||
                right.type !== ValueType_1.ValueTypeEnum.BOOL) {
                this.errors.push("Line: " +
                    expression.lineNum.toString() +
                    " Expected type: " +
                    ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.BOOL] +
                    " but got: " +
                    ValueType_1.ValueTypeNames[left.type]);
            }
            expression.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.BOOL, expression.lineNum);
            return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.BOOL, expression.lineNum);
        }
        this.errors.push("Line: " +
            expression.lineNum.toString() +
            " Operator " +
            expression.operator +
            " not supported");
        return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
    }
    checkFunctionDeclaration(statement, varEnv, funcEnv) {
        let type = funcEnv.lookUp(statement.name.value);
        if (type !== null) {
            this.errors.push("FunctionObject " +
                statement.name.value +
                " already declared in Line: " +
                statement.lineNum.toString());
        }
        funcEnv.addFunc(statement.name.value, statement.returnType, statement.parameters, varEnv);
        let returnType = null;
        if (statement.returnType instanceof ValueType_1.ValueType) {
            returnType = statement.returnType;
        }
        varEnv = varEnv.enterScope();
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            let type = statement.parameters.get(key);
            varEnv.addVar(key, type);
        }
        this.checkStatement(statement.body, varEnv, funcEnv, returnType);
        statement.varEnv = varEnv;
        return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.FUNCTION_DECLARATION, statement.lineNum);
    }
    checkUnaryExpression(expression, varEnv, funcEnv) {
        let typeOfExpression = this.checkExpression(expression.primaryOrRight, varEnv, funcEnv);
        if (typeOfExpression === null || !(typeOfExpression instanceof ValueType_1.ValueType)) {
            this.errors.push("Line: " +
                expression.lineNum.toString() +
                " Expected type: " +
                ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.DOUBLE] +
                " or " +
                ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.BOOL] +
                " but got: " +
                ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.Error]);
            return null;
        }
        let type = typeOfExpression;
        if (expression.operator === "!") {
            if (type.type !== ValueType_1.ValueTypeEnum.BOOL) {
                this.errors.push("Line: " +
                    expression.lineNum.toString() +
                    " Expected type: " +
                    ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.BOOL] +
                    " but got: " +
                    ValueType_1.ValueTypeNames[type.type]);
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
            }
            expression.type = type;
            return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.BOOL, expression.lineNum);
        }
        if (expression.operator === "-") {
            if (type.type !== ValueType_1.ValueTypeEnum.DOUBLE &&
                type.type !== ValueType_1.ValueTypeEnum.INT) {
                this.errors.push("Line: " +
                    expression.lineNum.toString() +
                    " Expected type: " +
                    ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.DOUBLE] +
                    " but got: " +
                    ValueType_1.ValueTypeNames[type.type]);
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
            }
            expression.type = type;
            return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.DOUBLE, expression.lineNum);
        }
        this.errors.push("Line: " +
            expression.lineNum.toString() +
            " Operator " +
            expression.operator +
            " not supported");
        return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
    }
    checkDouble(term, varEnv, funcEnv) {
        term.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.DOUBLE, term.lineNum);
        return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.DOUBLE, term.lineNum);
    }
    checkInt(term, varEnv, funcEnv) {
        term.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.INT, term.lineNum);
        return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.INT, term.lineNum);
    }
    checkBool(term, varEnv, funcEnv) {
        term.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.BOOL, term.lineNum);
        return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.BOOL, term.lineNum);
    }
    checkString(param, varEnv, funcEnv) {
        param.type = new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.STRING, param.lineNum);
        return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.STRING, param.lineNum);
    }
    checkIdentifier(term, varEnv, funcEnv) {
        let type = varEnv.lookUpType(term.value);
        if (type === null) {
            this.errors.push("0_Variable " +
                term.value +
                " not declared in Line: " +
                term.lineNum.toString());
            return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, term.lineNum);
        }
        term.type = type;
        return type;
    }
    checkDeclaration(statement, varEnv, funcEnv) {
        let exprType = null;
        if (statement.expression !== null) {
            exprType = this.checkExpression(statement.expression, varEnv, funcEnv);
        }
        if (exprType !== null && exprType.type !== statement.type.type) {
            this.errors.push("Line: " +
                statement.lineNum.toString() +
                " Expected type: " +
                ValueType_1.ValueTypeNames[statement.type.type] +
                " but got: " +
                ValueType_1.ValueTypeNames[exprType.type]);
        }
        if (statement.global) {
            varEnv.addGlobalVar(statement.identifier.value, statement.type);
        }
        else {
            varEnv.addVar(statement.identifier.value, statement.type);
        }
        return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.VAR_DECL, statement.lineNum);
    }
    checkWhile(statement, varEnv, funcEnv, currentReturnType) {
        let initType = null;
        if (statement.initiator !== null) {
            initType = this.checkStatement(statement.initiator, varEnv, funcEnv, currentReturnType);
        }
        if (initType !== null &&
            initType.type !== StatementType_1.StatementTypeEnum.VAR_DECL &&
            initType.type !== StatementType_1.StatementTypeEnum.ASSIGNMENT) {
            this.errors.push("Line: " +
                statement.lineNum.toString() +
                " Expected type: " +
                StatementType_1.StatementTypeNames[StatementType_1.StatementTypeEnum.VAR_DECL] +
                " or " +
                StatementType_1.StatementTypeNames[StatementType_1.StatementTypeEnum.ASSIGNMENT] +
                " but got: " +
                StatementType_1.StatementTypeNames[initType.type]);
        }
        let condType = this.checkExpression(statement.condition, varEnv, funcEnv);
        if (condType === null) {
            this.errors.push("Line: " +
                statement.lineNum.toString() +
                " Expected type: " +
                ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.BOOL] +
                " but got: " +
                ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.Error]);
        }
        let condTypeValue = condType;
        if (statement.body !== null) {
            this.checkStatement(statement.body, varEnv, funcEnv, currentReturnType);
        }
        if (condTypeValue.type !== ValueType_1.ValueTypeEnum.BOOL) {
            this.errors.push("Line: " +
                statement.lineNum.toString() +
                " Expected type: " +
                ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.BOOL] +
                " but got: " +
                ValueType_1.ValueTypeNames[condTypeValue.type]);
        }
        return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.WHILE, statement.lineNum);
    }
    checkAssignment(statement, varEnv, funcEnv) {
        let exprType = this.checkExpression(statement.expression, varEnv, funcEnv);
        let identifierType = varEnv.lookUpType(statement.identifier.value);
        if (identifierType === null) {
            this.errors.push("1_Variable " +
                statement.identifier.value +
                " not declared in Line: " +
                statement.lineNum.toString());
            return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.ERROR, statement.lineNum);
        }
        if (exprType.type !== identifierType.type) {
            this.errors.push("Line: " +
                statement.lineNum.toString() +
                " Expected type: " +
                ValueType_1.ValueTypeNames[identifierType.type] +
                " but got: " +
                ValueType_1.ValueTypeNames[exprType.type]);
            return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.ERROR, statement.lineNum);
        }
        return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.ASSIGNMENT, statement.lineNum);
    }
    checkIfStatement(statement, varEnv, funcEnv, currentReturnType) {
        let condType = this.checkExpression(statement.condition, varEnv, funcEnv);
        if (condType.type !== ValueType_1.ValueTypeEnum.BOOL) {
            this.errors.push("Line: " +
                statement.lineNum.toString() +
                " Expected type: " +
                ValueType_1.ValueTypeNames[ValueType_1.ValueTypeEnum.BOOL] +
                " but got: " +
                ValueType_1.ValueTypeNames[condType.type]);
        }
        if (statement.body !== null) {
            this.checkStatement(statement.body, varEnv, funcEnv, currentReturnType);
        }
        if (statement.else !== null) {
            this.checkStatement(statement.else, varEnv, funcEnv, currentReturnType);
        }
        return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.IF, statement.lineNum);
    }
    checkFunctionCallStatement(statement, varEnv, funcEnv) {
        let func = funcEnv.lookUp(statement.functionName);
        if (func === null) {
            this.errors.push("Function " +
                statement.functionName +
                " not declared in Line: " +
                statement.lineNum.toString());
            return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.ERROR, statement.lineNum);
        }
        if (func.parameters.keys().length !== statement.actualParameters.length) {
            this.errors.push("Function " +
                statement.functionName +
                " expected " +
                func.parameters.keys().length.toString() +
                " parameters but got " +
                statement.actualParameters.length.toString() +
                " in Line: " +
                statement.lineNum.toString());
            return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.ERROR, statement.lineNum);
        }
        for (let i = 0; i < statement.actualParameters.length; i++) {
            let paramType = this.checkExpression(statement.actualParameters[i], varEnv, funcEnv);
            let expectedType = func.parameters.get(func.parameters.keys()[i]);
            if (!this.checkIfTypesAreConvertible(paramType.type, expectedType.type)) {
                this.errors.push("Function " +
                    statement.functionName +
                    " expected parameter " +
                    i.toString() +
                    " to be of type " +
                    ValueType_1.ValueTypeNames[expectedType.type] +
                    " but got " +
                    ValueType_1.ValueTypeNames[paramType.type] +
                    " in Line: " +
                    statement.lineNum.toString());
                return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.ERROR, statement.lineNum);
            }
        }
        statement.expectedParameters = func.parameters.values();
        return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.FUNCTION_CALL, statement.lineNum);
    }
    checkFunctionCallExpression(expression, varEnv, funcEnv) {
        let func = funcEnv.lookUp(expression.functionName);
        if (func === null) {
            this.errors.push("Function " +
                expression.functionName +
                " not declared in Line: " +
                expression.lineNum.toString());
            return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
        }
        if (func.parameters.keys().length !== expression.actualParameters.length) {
            this.errors.push("Function " +
                expression.functionName +
                " expected " +
                func.parameters.keys().length.toString() +
                " parameters but got " +
                expression.actualParameters.length.toString() +
                " in Line: " +
                expression.lineNum.toString());
            return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
        }
        for (let i = 0; i < expression.actualParameters.length; i++) {
            let paramType = this.checkExpression(expression.actualParameters[i], varEnv, funcEnv);
            let expectedType = func.parameters.get(func.parameters.keys()[i]);
            if (paramType.type !== expectedType.type) {
                this.errors.push("Function " +
                    expression.functionName +
                    " expected parameter " +
                    i.toString() +
                    " to be of type " +
                    ValueType_1.ValueTypeNames[expectedType.type] +
                    " but got " +
                    ValueType_1.ValueTypeNames[paramType.type] +
                    " in Line: " +
                    expression.lineNum.toString());
                return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
            }
        }
        expression.expectedParameters = func.parameters.values();
        if (func.returnType instanceof ValueType_1.ValueType) {
            expression.type = func.returnType;
            return func.returnType;
        }
        this.errors.push("Function " +
            expression.functionName +
            " has no return type in Line: " +
            expression.lineNum.toString());
        return new ValueType_1.ValueType(ValueType_1.ValueTypeEnum.Error, expression.lineNum);
    }
    checkImport(statement1, varEnv, funcEnv) {
        let func = funcEnv.lookUp(statement1.name.value);
        if (func !== null) {
            this.errors.push("FunctionObject " +
                statement1.name.value +
                " already declared in Line: " +
                statement1.lineNum.toString());
        }
        varEnv = varEnv.enterScope();
        for (let i = 0; i < statement1.parameters.keys().length; i++) {
            let key = statement1.parameters.keys()[i];
            let type = statement1.parameters.get(key);
            varEnv.addVar(key, type);
        }
        funcEnv.addFunc(statement1.name.value, statement1.returnType, statement1.parameters, varEnv);
        return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.IMPORT, statement1.lineNum);
    }
    checkIfTypesAreConvertible(type1, type2) {
        if (type1 === type2) {
            return true;
        }
        if ((type1 === ValueType_1.ValueTypeEnum.DOUBLE && type2 === ValueType_1.ValueTypeEnum.INT) ||
            (type1 === ValueType_1.ValueTypeEnum.INT && type2 === ValueType_1.ValueTypeEnum.DOUBLE)) {
            return true;
        }
        if ((type1 === ValueType_1.ValueTypeEnum.DOUBLE && type2 === ValueType_1.ValueTypeEnum.STRING) ||
            (type1 === ValueType_1.ValueTypeEnum.STRING && type2 === ValueType_1.ValueTypeEnum.DOUBLE)) {
            return true;
        }
        if ((type1 === ValueType_1.ValueTypeEnum.STRING && type2 === ValueType_1.ValueTypeEnum.INT) ||
            (type1 === ValueType_1.ValueTypeEnum.INT && type2 === ValueType_1.ValueTypeEnum.STRING)) {
            return true;
        }
        if ((type1 === ValueType_1.ValueTypeEnum.STRING && type2 === ValueType_1.ValueTypeEnum.BOOL) ||
            (type1 === ValueType_1.ValueTypeEnum.BOOL && type2 === ValueType_1.ValueTypeEnum.STRING)) {
            return true;
        }
        return false;
    }
    checkReturnStatement(statement, varEnv, funcEnv, currentReturnType) {
        let returnType = this.checkExpression(statement.expression, varEnv, funcEnv);
        if (currentReturnType === null) {
            return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.RETURN, statement.lineNum);
        }
        if (returnType.type != currentReturnType.type) {
            this.errors.push("Line: " +
                statement.lineNum.toString() +
                " Expected type: " +
                ValueType_1.ValueTypeNames[currentReturnType.type] +
                " but got: " +
                ValueType_1.ValueTypeNames[returnType.type]);
            return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.ERROR, statement.lineNum);
        }
        return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.RETURN, statement.lineNum);
    }
}
exports.CombinedChecker = CombinedChecker;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToAstVisitor = void 0;
const Identifier_1 = require("./Nodes/Expressions/Terms/Identifier");
const Int_1 = require("./Nodes/Expressions/Terms/Int");
const BinaryExpression_1 = require("./Nodes/Expressions/BinaryExpression");
const UnaryExpression_1 = require("./Nodes/Expressions/UnaryExpression");
const Term_1 = require("./Nodes/Expressions/Terms/Term");
const Declaration_1 = require("./Nodes/Statements/Declaration");
const ValueType_1 = require("./Nodes/Types/ValueType");
const Program_1 = require("./Nodes/Statements/Program");
const While_1 = require("./Nodes/Statements/While");
const Assignment_1 = require("./Nodes/Statements/Assignment");
const IfStatement_1 = require("./Nodes/Statements/IfStatement");
const CompoundStatement_1 = require("./Nodes/Statements/CompoundStatement");
const ASTString_1 = require("./Nodes/Expressions/Terms/ASTString");
const Bool_1 = require("./Nodes/Expressions/Terms/Bool");
const FunctionDeclaration_1 = require("./Nodes/Statements/FunctionDeclaration");
const StatementType_1 = require("./Nodes/Types/StatementType");
const FunctionCallExpression_1 = require("./Nodes/Expressions/FunctionCallExpression");
const FunctionCallStatement_1 = require("./Nodes/Statements/FunctionCallStatement");
const Return_1 = require("./Nodes/Statements/Return");
const ImportFunction_1 = require("./Nodes/Statements/ImportFunction");
const Double_1 = require("./Nodes/Expressions/Terms/Double");
class ToAstVisitor {
    visitInt(term) {
        return new Int_1.Int(term.value.literal, term.lineNum);
    }
    visitDouble(term) {
        return new Double_1.Double(term.value.literal, term.lineNum);
    }
    visitImport(statement) {
        let parentPath = statement.parentPath.accept(this);
        let childPath = statement.childPath.accept(this);
        let functionDeclarationWithoutBody = statement.functionDeclarationWithoutBody.accept(this);
        return new ImportFunction_1.ImportFunction(parentPath.value, childPath.value, functionDeclarationWithoutBody, statement.lineNum);
    }
    visitReturn(statement) {
        let expression = null;
        if (statement.expression !== null) {
            expression = statement.expression.accept(this);
        }
        return new Return_1.Return(expression, statement.lineNum);
    }
    visitFunctionCallExpression(expression) {
        let functionName = expression.functionName.literal;
        let actualParameters = [];
        for (let i = 0; i < expression.actualParameters.length; i++) {
            actualParameters.push(expression.actualParameters[i].accept(this));
        }
        return new FunctionCallExpression_1.FunctionCallExpression(functionName, actualParameters, expression.lineNum);
    }
    visitFunctionCallStatement(statement) {
        let functionName = statement.functionName.literal;
        let actualParameters = [];
        for (let i = 0; i < statement.actualParameters.length; i++) {
            actualParameters.push(statement.actualParameters[i].accept(this));
        }
        return new FunctionCallStatement_1.FunctionCallStatement(functionName, actualParameters, statement.lineNum);
    }
    visitFunction(statement) {
        let returnType = statement.returnType.accept(this);
        let name = statement.name.accept(this);
        let parameters = new Map();
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            parameters.set(key.accept(this).value, statement.parameters
                .get(key)
                .accept(this));
        }
        let body = statement.body != null
            ? statement.body.accept(this)
            : null;
        return new FunctionDeclaration_1.FunctionDeclaration(returnType, name, parameters, body, statement.export, statement.lineNum);
    }
    visitString(param) {
        return new ASTString_1.ASTString(param.value.literal, param.lineNum);
    }
    visitIfStatement(statement) {
        let condition = statement.condition.accept(this);
        let body = null;
        if (statement.body !== null) {
            body = statement.body.accept(this);
        }
        let $else = null;
        if (statement.else !== null) {
            $else = statement.else.accept(this);
        }
        return new IfStatement_1.IfStatement(condition, body, $else, statement.lineNum);
    }
    visitAssignment(statement) {
        let identifier = statement.identifier.accept(this);
        let expression = statement.expression.accept(this);
        return new Assignment_1.Assignment(identifier, expression, statement.lineNum);
    }
    visitLoopStatement(statement) {
        let initiator = null;
        if (statement.initiator !== null) {
            initiator = statement.initiator.accept(this);
        }
        let expression = statement.condition.accept(this);
        let body = statement.body.accept(this);
        return new While_1.While(initiator, expression, body, statement.lineNum);
    }
    visitProgram(statement) {
        let body = null;
        if (statement.body !== null) {
            body = statement.body.accept(this);
        }
        return new Program_1.Program(body, statement.lineNum);
    }
    visitDeclaration(statement) {
        let identifier = statement.identifier.accept(this);
        let type = statement.type.accept(this);
        let expression = null;
        if (statement.expression !== null) {
            expression = statement.expression.accept(this);
        }
        let $export = statement.export;
        return new Declaration_1.Declaration(identifier, type, expression, $export, statement.global, statement.lineNum);
    }
    visitType(type) {
        let typ = ValueType_1.ValueTypeEnum.Error;
        if (type.name.literal === "int") {
            typ = ValueType_1.ValueTypeEnum.INT;
        }
        if (type.name.literal === "string") {
            typ = ValueType_1.ValueTypeEnum.STRING;
        }
        if (type.name.literal === "bool") {
            typ = ValueType_1.ValueTypeEnum.BOOL;
        }
        if (type.name.literal === "double") {
            typ = ValueType_1.ValueTypeEnum.DOUBLE;
        }
        if (type.name.literal === "void") {
            return new StatementType_1.StatementType(StatementType_1.StatementTypeEnum.VOID, type.lineNum);
        }
        if (typ === ValueType_1.ValueTypeEnum.Error) {
            throw new Error("Invalid type: " +
                type.name.literal +
                " at line: " +
                type.lineNum.toString());
        }
        return new ValueType_1.ValueType(typ, type.lineNum);
    }
    visitPowExpression(expression) {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept(this);
        }
        let left = expression.primaryOrLeft.accept(this);
        let right = expression.right.accept(this);
        return new BinaryExpression_1.BinaryExpression(left, expression.operator.literal, right, expression.lineNum);
    }
    visitAdditiveExpression(expression) {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept(this);
        }
        let left = expression.primaryOrLeft.accept(this);
        let right = expression.right.accept(this);
        return new BinaryExpression_1.BinaryExpression(left, expression.operator.literal, right, expression.lineNum);
    }
    visitEqualityExpression(expression) {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept(this);
        }
        let left = expression.primaryOrLeft.accept(this);
        let right = expression.right.accept(this);
        return new BinaryExpression_1.BinaryExpression(left, expression.operator.literal, right, expression.lineNum);
    }
    visitExpression(expression) {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept(this);
        }
        let left = expression.primaryOrLeft.accept(this);
        let right = expression.right.accept(this);
        return new BinaryExpression_1.BinaryExpression(left, expression.operator.literal, right, expression.lineNum);
    }
    visitIdentifier(term) {
        return new Identifier_1.Identifier(term.name.literal, term.lineNum);
    }
    visitMultiplicativeExpression(expression) {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept(this);
        }
        let left = expression.primaryOrLeft.accept(this);
        let right = expression.right.accept(this);
        return new BinaryExpression_1.BinaryExpression(left, expression.operator.literal, right, expression.lineNum);
    }
    visitNumber(term) {
        return new Int_1.Int(term.value.literal, term.lineNum);
    }
    visitBool(term) {
        return new Bool_1.Bool(term.value.literal, term.lineNum);
    }
    visitRelationalExpression(expression) {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept(this);
        }
        let left = expression.primaryOrLeft.accept(this);
        let right = expression.right.accept(this);
        return new BinaryExpression_1.BinaryExpression(left, expression.operator.literal, right, expression.lineNum);
    }
    visitTerm(term) {
        return new Term_1.Term(term.value, term.lineNum);
    }
    visitUnaryExpression(expression) {
        if (expression.operator === null) {
            return expression.primaryOrRight.accept(this);
        }
        let primaryOrRight = expression.primaryOrRight.accept(this);
        return new UnaryExpression_1.UnaryExpression(expression.operator.literal, primaryOrRight, expression.lineNum);
    }
    visitCompoundStatement(statement) {
        let left = statement.left.accept(this);
        let right = statement.right.accept(this);
        return new CompoundStatement_1.CompoundStatement(left, right, statement.lineNum);
    }
    visitIncrement(statement) {
        let identifier = statement.identifier.accept(this);
        let operator = null;
        if (statement.operator === "++") {
            operator = "+";
        }
        if (statement.operator === "--") {
            operator = "-";
        }
        return new Assignment_1.Assignment(identifier, new BinaryExpression_1.BinaryExpression(identifier, operator, new Int_1.Int("1", statement.lineNum), statement.lineNum), statement.lineNum);
    }
}
exports.ToAstVisitor = ToAstVisitor;

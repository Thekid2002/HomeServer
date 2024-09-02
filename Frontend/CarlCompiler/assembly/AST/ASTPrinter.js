"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTPrinter = void 0;
const ValueType_1 = require("./Nodes/Types/ValueType");
const StatementType_1 = require("./Nodes/Types/StatementType");
class ASTPrinter {
    constructor() {
        this.number = 0;
        this.tree = [];
    }
    visitCompoundStatement(statement) {
        statement.left.accept(this);
        statement.right.accept(this);
    }
    visitAssignment(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Assignment");
        this.number++;
        statement.identifier.accept(this);
        statement.expression.accept(this);
        this.number--;
    }
    visitWhile(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": While");
        this.number++;
        statement.condition.accept(this);
        if (statement.body !== null) {
            statement.body.accept(this);
        }
        this.number--;
    }
    visitFunctionDeclaration(statement) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": FunctionDeclaration");
        this.number++;
        statement.returnType.accept(this);
        statement.name.accept(this);
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            statement.parameters.get(key).accept(this);
        }
        if (statement.body !== null) {
            statement.body.accept(this);
        }
        this.number--;
    }
    visitFunctionCallExpression(expression) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": FunctionCallExpression " +
            expression.functionName);
        this.number++;
        for (let i = 0; i < expression.actualParameters.length; i++) {
            expression.actualParameters[i].accept(this);
        }
        this.number--;
    }
    visitFunctionCallStatement(statement) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": FunctionCallStatement " +
            statement.functionName);
        this.number++;
        for (let i = 0; i < statement.actualParameters.length; i++) {
            statement.actualParameters[i].accept(this);
        }
        this.number--;
    }
    visitProgram(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Program");
        this.number++;
        if (statement.body !== null) {
            statement.body.accept(this);
        }
        this.number--;
    }
    visitBinaryExpression(expression) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": BinaryExpression " +
            (expression.operator !== null ? expression.operator : ""));
        this.number++;
        expression.primaryOrLeft.accept(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right.accept(this);
            this.number--;
        }
    }
    visitIdentifier(term) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": Identifier " +
            term.value);
    }
    visitInt(term) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": Int " +
            term.value);
    }
    visitDouble(term) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": Double " +
            term.value);
    }
    visitBool(term) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": Bool " +
            term.value);
    }
    visitString(param) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": String " +
            param.value);
    }
    visitTerm(term) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": Term " +
            term.value);
    }
    visitUnaryExpression(expression) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": UnaryExpression " +
            (expression.operator !== null ? expression.operator : ""));
        this.number++;
        expression.primaryOrRight.accept(this);
        this.number--;
    }
    getSpace(num) {
        let space = "";
        for (let i = 0; i < num; i++) {
            space += " ";
        }
        return space;
    }
    visitDeclaration(statement) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": Declaration " +
            statement.identifier.value +
            " global: " +
            statement.global.toString() +
            " export: " +
            statement.export.toString());
        this.number++;
        statement.type.accept(this);
        this.number--;
        if (statement.expression !== null) {
            this.number++;
            statement.expression.accept(this);
            this.number--;
        }
    }
    visitImport(statement) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": Import " +
            statement.parentPath +
            "." +
            statement.childPath);
        this.number++;
        statement.returnType.accept(this);
        statement.name.accept(this);
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            statement.parameters.get(key).accept(this);
        }
        this.number--;
    }
    visitValueType(type) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ValueType " +
            ValueType_1.ValueTypeNames[type.type]);
    }
    visitStatementType(statement) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": StatementType " +
            StatementType_1.StatementTypeNames[statement.type]);
    }
    visitIfStatement(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": IfStatement");
        this.number++;
        statement.condition.accept(this);
        if (statement.body !== null) {
            statement.body.accept(this);
        }
        if (statement.else !== null) {
            statement.else.accept(this);
        }
        this.number--;
    }
    visitReturn(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Return");
        this.number++;
        statement.expression.accept(this);
        this.number--;
    }
}
exports.ASTPrinter = ASTPrinter;

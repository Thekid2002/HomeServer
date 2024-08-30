"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTreePrinter = void 0;
class ParseTreePrinter {
    constructor() {
        this.number = 0;
        this.tree = [];
    }
    visitCompoundStatement(statement) {
        statement.left.accept(this);
        statement.right.accept(this);
    }
    visitAssignment(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseAssignment");
        this.number++;
        statement.identifier.accept(this);
        statement.expression.accept(this);
        this.number--;
    }
    visitIncrement(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseIncrement");
        this.number++;
        statement.identifier.accept(this);
        this.number--;
    }
    visitFunction(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": FunctionObject");
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
    visitLoopStatement(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": While");
        this.number++;
        statement.condition.accept(this);
        if (statement.body !== null) {
            statement.body.accept(this);
        }
        this.number--;
    }
    visitProgram(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseProgram");
        this.number++;
        if (statement.body !== null) {
            statement.body.accept(this);
        }
        this.number--;
    }
    visitPowExpression(expression) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ParsePowExpression " +
            (expression.operator !== null ? expression.operator.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right.accept(this);
            this.number--;
        }
    }
    visitAdditiveExpression(expression) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ParseAdditiveExpression " +
            (expression.operator !== null ? expression.operator.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right.accept(this);
            this.number--;
        }
    }
    visitEqualityExpression(expression) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ParseEqualityExpression " +
            (expression.operator !== null ? expression.operator.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right.accept(this);
            this.number--;
        }
    }
    visitExpression(expression) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ParseExpression " +
            (expression.operator !== null ? expression.operator.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right.accept(this);
            this.number--;
        }
    }
    visitMultiplicativeExpression(expression) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ParseMultiplicativeExpression " +
            (expression.operator !== null ? expression.operator.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right.accept(this);
            this.number--;
        }
    }
    visitInt(term) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": Int " +
            term.value.literal);
    }
    visitDouble(term) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": Double " +
            term.value.literal);
    }
    visitBool(term) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": Bool " +
            term.value.literal);
    }
    visitString(param) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ASTString " +
            param.value.literal);
    }
    visitReturn(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseReturn");
        this.number++;
        statement.expression.accept(this);
        this.number--;
    }
    visitRelationalExpression(expression) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ParseRelationalExpression " +
            (expression.operator !== null ? expression.operator.literal : ""));
        this.number++;
        expression.primaryOrLeft.accept(this);
        this.number--;
        if (expression.right !== null) {
            this.number++;
            expression.right.accept(this);
            this.number--;
        }
    }
    visitTerm(term) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ParseTerm " +
            term.value);
    }
    visitUnaryExpression(expression) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ParseUnaryExpression " +
            (expression.operator !== null ? expression.operator.literal : ""));
        this.number++;
        expression.primaryOrRight.accept(this);
        this.number--;
    }
    visitIdentifier(term) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ParseIdentifier " +
            term.name.literal);
    }
    getSpace(num) {
        let space = "";
        for (let i = 0; i < num; i++) {
            space += "  ";
        }
        return space;
    }
    visitDeclaration(statement) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ParseDeclaration " +
            statement.identifier.name.literal +
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
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": ParseImport");
        this.number++;
        statement.parentPath.accept(this);
        statement.childPath.accept(this);
        statement.functionDeclarationWithoutBody.accept(this);
        this.number--;
    }
    visitType(type) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": ParseType " +
            type.name.literal);
    }
    visitIfStatement(statement) {
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": If");
        this.number++;
        statement.condition.accept(this);
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Then");
        this.number++;
        if (statement.body !== null) {
            statement.body.accept(this);
        }
        this.number--;
        this.tree.push(this.getSpace(this.number) + this.number.toString() + ": Else");
        this.number++;
        if (statement.else !== null) {
            statement.else.accept(this);
        }
        this.number--;
        this.number--;
    }
    visitFunctionCallExpression(statement) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": FunctionCall " +
            statement.functionName.literal);
        this.number++;
        for (let i = 0; i < statement.actualParameters.length; i++) {
            statement.actualParameters[i].accept(this);
        }
        this.number--;
    }
    visitFunctionCallStatement(statement) {
        this.tree.push(this.getSpace(this.number) +
            this.number.toString() +
            ": FunctionCall " +
            statement.functionName.literal);
        this.number++;
        for (let i = 0; i < statement.actualParameters.length; i++) {
            statement.actualParameters[i].accept(this);
        }
        this.number--;
    }
}
exports.ParseTreePrinter = ParseTreePrinter;

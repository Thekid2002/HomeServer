"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const TokenType_1 = require("../Lexer/TokenType");
const ParseEqualityExpression_1 = require("./Expressions/ParseEqualityExpression");
const ParseRelationalExpression_1 = require("./Expressions/ParseRelationalExpression");
const ParseMultiplicativeExpression_1 = require("./Expressions/ParseMultiplicativeExpression");
const ParseUnaryExpression_1 = require("./Expressions/ParseUnaryExpression");
const ParseTerm_1 = require("./Expressions/Terms/ParseTerm");
const ParseInt_1 = require("./Expressions/Terms/ParseInt");
const ParseIdentifier_1 = require("./Expressions/Terms/ParseIdentifier");
const ParseExpression_1 = require("./Expressions/ParseExpression");
const ParsePowExpression_1 = require("./Expressions/ParsePowExpression");
const ParseAdditiveExpression_1 = require("./Expressions/ParseAdditiveExpression");
const ParseProgram_1 = require("./Statements/ParseProgram");
const ParseDeclaration_1 = require("./Statements/ParseDeclaration");
const ParseType_1 = require("./Expressions/Terms/ParseType");
const ParseLoopStatement_1 = require("./Statements/ParseLoopStatement");
const ParseAssignment_1 = require("./Statements/ParseAssignment");
const ParseIfStatement_1 = require("./Statements/ParseIfStatement");
const ParseCompoundStatement_1 = require("./Statements/ParseCompoundStatement");
const ParseString_1 = require("./Expressions/Terms/ParseString");
const ParseIncrement_1 = require("./Statements/ParseIncrement");
const ParseBool_1 = require("./Expressions/Terms/ParseBool");
const ParseFunctionDeclaration_1 = require("./Statements/ParseFunctionDeclaration");
const ParseFunctionCallStatement_1 = require("./Statements/ParseFunctionCallStatement");
const ParseFunctionCallExpression_1 = require("./Expressions/Terms/ParseFunctionCallExpression");
const ParseReturn_1 = require("./Statements/ParseReturn");
const ParseImport_1 = require("./Statements/ParseImport");
const ParseDouble_1 = require("./Expressions/Terms/ParseDouble");
class Parser {
    constructor(tokens) {
        this.current = 0;
        this.errors = [];
        this.tokens = tokens;
    }
    parse() {
        let prg = this.program();
        if (!this.isAtEnd()) {
            this.errors.push("Parser: Unexpected token: " +
                this.peek().literal +
                " at line: " +
                this.peek().line.toString());
        }
        return prg;
    }
    program() {
        let statements = [];
        while (!this.isAtEnd()) {
            let statement = this.complexStatement();
            if (statement !== null) {
                statements.push(statement);
            }
            else {
                this.errors.push("ParseProgram: Unexpected token:" +
                    this.peek().literal +
                    " at line: " +
                    this.peek().line.toString());
                break;
            }
        }
        if (statements.length === 0) {
            return null;
        }
        let body = this.toCompoundStatement(statements);
        return new ParseProgram_1.ParseProgram(body, statements[0].lineNum);
    }
    complexStatement() {
        let statement = null;
        let exportStatement = false;
        if (this.matchAdvance([ TokenType_1.TokenType.EXPORT ])) {
            exportStatement = true;
        }
        if (this.matchAdvance([ TokenType_1.TokenType.IMPORT ])) {
            let importParent = null;
            let importChild = null;
            if (this.match([ TokenType_1.TokenType.STRING_LITERAL ])) {
                importParent = this.term();
            }
            else {
                this.errors.push("Expected string literal after import at line: " +
                    this.peek().line.toString());
                return null;
            }
            if (this.match([ TokenType_1.TokenType.STRING_LITERAL ])) {
                importChild = this.term();
            }
            else {
                this.errors.push("Expected string literal after import at line: " +
                    this.peek().line.toString());
                return null;
            }
            let functionDeclarationWithoutBody = this.functionDeclarationWithoutBody(exportStatement);
            if (functionDeclarationWithoutBody == null) {
                this.errors.push("Expected function declaration after import at line: " +
                    this.peek().line.toString());
                return null;
            }
            statement = new ParseImport_1.ParseImport(importParent, importChild, functionDeclarationWithoutBody, functionDeclarationWithoutBody.lineNum);
        }
        else if (this.match([
            TokenType_1.TokenType.INT,
            TokenType_1.TokenType.DOUBLE,
            TokenType_1.TokenType.BOOL,
            TokenType_1.TokenType.STRING,
            TokenType_1.TokenType.VOID
        ])) {
            if (this.peekpeek().type === TokenType_1.TokenType.IDENTIFIER) {
                if (this.peekpeekpeek().type === TokenType_1.TokenType.LEFT_PAREN) {
                    statement = this.functionDeclarationWithBody(exportStatement);
                }
                else {
                    statement = this.declaration(exportStatement, true);
                }
            }
        }
        else {
            this.errors.push("ComplexStatement: Unexpected token: " +
                this.peek().literal +
                " at line: " +
                this.peek().line.toString());
            return null;
        }
        this.matchAdvance([ TokenType_1.TokenType.SEMICOLON ]);
        return statement;
    }
    statement() {
        let statement = null;
        if (this.match([ TokenType_1.TokenType.IF ])) {
            statement = this.ifStatement();
        }
        else if (this.matchAdvance([ TokenType_1.TokenType.RETURN ])) {
            statement = this.return();
        }
        else if (this.match([
            TokenType_1.TokenType.INT,
            TokenType_1.TokenType.DOUBLE,
            TokenType_1.TokenType.BOOL,
            TokenType_1.TokenType.STRING,
            TokenType_1.TokenType.VOID
        ])) {
            if (this.peekpeek().type === TokenType_1.TokenType.IDENTIFIER) {
                if (this.peekpeekpeek().type === TokenType_1.TokenType.LEFT_PAREN) {
                    statement = this.functionDeclarationWithBody(false);
                }
                else {
                    statement = this.declaration(false, false);
                }
            }
        }
        else if (this.match([ TokenType_1.TokenType.IDENTIFIER ])) {
            if (this.peekpeek().type === TokenType_1.TokenType.LEFT_PAREN) {
                statement = this.functionCallStatement();
            }
            else if (this.peekpeek().type === TokenType_1.TokenType.EQUAL) {
                statement = this.assignment();
            }
            else {
                statement = this.increment();
            }
        }
        else if (this.match([ TokenType_1.TokenType.WHILE, TokenType_1.TokenType.FOR ])) {
            statement = this.loop();
        }
        else {
            this.errors.push("ParseStatement: Unexpected token: " +
                this.peek().literal +
                " at line: " +
                this.peek().line.toString());
            return null;
        }
        this.matchAdvance([ TokenType_1.TokenType.SEMICOLON ]);
        return statement;
    }
    declaration($export, global) {
        let type = this.type();
        if (type === null) {
            this.errors.push("Error in type");
            console.log("Error in type");
            return null;
        }
        let identifier = this.identifier();
        if (identifier === null) {
            this.errors.push("Error in identifier");
            return null;
        }
        let expression = null;
        if (this.matchAdvance([ TokenType_1.TokenType.EQUAL ])) {
            expression = this.expression();
        }
        return new ParseDeclaration_1.ParseDeclaration(identifier, type, expression, $export, global, identifier.lineNum);
    }
    expression() {
        let leftOrPrimary = this.equalityExpression();
        let operator = null;
        let right = null;
        while (this.matchAdvance([ TokenType_1.TokenType.AND, TokenType_1.TokenType.OR ])) {
            operator = this.previous();
            right = this.equalityExpression();
            leftOrPrimary = new ParseExpression_1.ParseExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }
        if (leftOrPrimary instanceof ParseExpression_1.ParseExpression) {
            return leftOrPrimary;
        }
        return new ParseExpression_1.ParseExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }
    equalityExpression() {
        let leftOrPrimary = this.relationExpression();
        let operator = null;
        let right = null;
        while (this.matchAdvance([ TokenType_1.TokenType.BANG_EQUAL, TokenType_1.TokenType.EQUAL_EQUAL ])) {
            operator = this.previous();
            right = this.relationExpression();
            leftOrPrimary = new ParseEqualityExpression_1.ParseEqualityExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }
        if (leftOrPrimary instanceof ParseEqualityExpression_1.ParseEqualityExpression) {
            return leftOrPrimary;
        }
        return new ParseEqualityExpression_1.ParseEqualityExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }
    relationExpression() {
        let leftOrPrimary = this.additiveExpression();
        let operator = null;
        let right = null;
        while (this.matchAdvance([
            TokenType_1.TokenType.GREATER,
            TokenType_1.TokenType.GREATER_EQUAL,
            TokenType_1.TokenType.LESS,
            TokenType_1.TokenType.LESS_EQUAL
        ])) {
            operator = this.previous();
            right = this.additiveExpression();
            leftOrPrimary = new ParseRelationalExpression_1.ParseRelationalExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }
        if (leftOrPrimary instanceof ParseRelationalExpression_1.ParseRelationalExpression) {
            return leftOrPrimary;
        }
        return new ParseRelationalExpression_1.ParseRelationalExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }
    isAtEnd() {
        if (this.current >= this.tokens.length) {
            this.errors.push("Unexpected end of input");
            return true;
        }
        return this.tokens[this.current].type === TokenType_1.TokenType.EOF;
    }
    peek() {
        return this.tokens[this.current];
    }
    peekpeek() {
        return this.tokens[this.current + 1];
    }
    peekpeekpeek() {
        return this.tokens[this.current + 2];
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    match(expected) {
        if (this.isAtEnd())
            return false;
        for (let i = 0; i < expected.length; i++) {
            if (this.tokens[this.current].type === expected[i]) {
                return true;
            }
        }
        return false;
    }
    matchAdvance(expected) {
        if (this.isAtEnd())
            return false;
        for (let i = 0; i < expected.length; i++) {
            if (this.tokens[this.current].type === expected[i]) {
                this.current++;
                return true;
            }
        }
        return false;
    }
    additiveExpression() {
        let leftOrPrimary = this.multExpression();
        let operator = null;
        let right = null;
        while (this.matchAdvance([ TokenType_1.TokenType.MINUS, TokenType_1.TokenType.PLUS ])) {
            operator = this.previous();
            right = this.multExpression();
            leftOrPrimary = new ParseAdditiveExpression_1.ParseAdditiveExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }
        if (leftOrPrimary instanceof ParseAdditiveExpression_1.ParseAdditiveExpression) {
            return leftOrPrimary;
        }
        return new ParseAdditiveExpression_1.ParseAdditiveExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }
    multExpression() {
        let leftOrPrimary = this.powerExpression();
        let operator = null;
        let right = null;
        while (this.matchAdvance([ TokenType_1.TokenType.SLASH, TokenType_1.TokenType.STAR, TokenType_1.TokenType.MOD ])) {
            operator = this.previous();
            right = this.powerExpression();
            leftOrPrimary = new ParseMultiplicativeExpression_1.ParseMultiplicativeExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }
        if (leftOrPrimary instanceof ParseMultiplicativeExpression_1.ParseMultiplicativeExpression) {
            return leftOrPrimary;
        }
        return new ParseMultiplicativeExpression_1.ParseMultiplicativeExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }
    powerExpression() {
        let leftOrPrimary = this.unaryExpression();
        let operator = null;
        let right = null;
        while (this.matchAdvance([ TokenType_1.TokenType.POW ])) {
            operator = this.previous();
            right = this.unaryExpression();
            leftOrPrimary = new ParsePowExpression_1.ParsePowExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }
        if (leftOrPrimary instanceof ParsePowExpression_1.ParsePowExpression) {
            return leftOrPrimary;
        }
        return new ParsePowExpression_1.ParsePowExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }
    unaryExpression() {
        let operator = null;
        let rightOrPrimary;
        if (this.matchAdvance([
            TokenType_1.TokenType.BANG,
            TokenType_1.TokenType.MINUS,
            TokenType_1.TokenType.SIN,
            TokenType_1.TokenType.SQRT,
            TokenType_1.TokenType.TAN,
            TokenType_1.TokenType.COS,
            TokenType_1.TokenType.ASIN,
            TokenType_1.TokenType.ACOS,
            TokenType_1.TokenType.ATAN
        ])) {
            operator = this.previous();
            rightOrPrimary = this.unaryExpression();
        }
        else {
            rightOrPrimary = this.term();
        }
        return new ParseUnaryExpression_1.ParseUnaryExpression(operator, rightOrPrimary, rightOrPrimary.lineNum);
    }
    type() {
        if (this.matchAdvance([
            TokenType_1.TokenType.INT,
            TokenType_1.TokenType.DOUBLE,
            TokenType_1.TokenType.BOOL,
            TokenType_1.TokenType.STRING,
            TokenType_1.TokenType.VOID
        ])) {
            return new ParseType_1.ParseType(this.previous(), this.previous().line);
        }
        if (!this.isAtEnd()) {
            this.errors.push("ParseType: Unexpected token: " +
                this.peek().literal +
                " at line: " +
                this.peek().line.toString());
        }
        else {
            this.errors.push("ParseType: Unexpected end of input");
        }
        return null;
    }
    term() {
        if (this.matchAdvance([ TokenType_1.TokenType.INT_LITERAL ])) {
            return new ParseInt_1.ParseInt(this.previous(), this.previous().line);
        }
        if (this.matchAdvance([ TokenType_1.TokenType.DOUBLE_LITERAL ])) {
            return new ParseDouble_1.ParseDouble(this.previous(), this.previous().line);
        }
        if (this.match([ TokenType_1.TokenType.IDENTIFIER ])) {
            let identifier = this.identifier();
            if (identifier === null) {
                this.errors.push("Error in identifier");
            }
            if (this.matchAdvance([ TokenType_1.TokenType.LEFT_PAREN ])) {
                return this.functionCallExpression(identifier);
            }
            return identifier;
        }
        if (this.matchAdvance([ TokenType_1.TokenType.STRING_LITERAL ])) {
            return new ParseString_1.ParseString(this.previous(), this.previous().line);
        }
        if (this.matchAdvance([ TokenType_1.TokenType.TRUE, TokenType_1.TokenType.FALSE ])) {
            return new ParseBool_1.ParseBool(this.previous(), this.previous().line);
        }
        this.errors.push("ParseTerm: Unexpected token: " +
            this.peek().literal +
            " at line: " +
            this.peek().line.toString());
        return new ParseTerm_1.ParseTerm("ERROR: No term matches: " + this.peek().literal, this.peek().line);
    }
    loop() {
        if (this.matchAdvance([ TokenType_1.TokenType.WHILE ])) {
            if (this.matchAdvance([ TokenType_1.TokenType.LEFT_PAREN ])) {
                return this.while();
            }
            this.errors.push("Expected '(' at line: " + this.peek().line.toString());
        }
        if (this.matchAdvance([ TokenType_1.TokenType.FOR ])) {
            if (this.matchAdvance([ TokenType_1.TokenType.LEFT_PAREN ])) {
                return this.for();
            }
            this.errors.push("Expected '(' at line: " + this.peek().line.toString());
        }
        this.errors.push("Loop: Unexpected token: " +
            this.peek().literal +
            " at line: " +
            this.peek().line.toString());
        return null;
    }
    while() {
        let expression = this.expression();
        if (!this.matchAdvance([ TokenType_1.TokenType.RIGHT_PAREN ])) {
            this.errors.push("2_Expected ')' at line: " + this.peek().line.toString());
            return null;
        }
        if (this.match([ TokenType_1.TokenType.LEFT_BRACE ])) {
            this.advance();
            let statements = [];
            while (!this.match([ TokenType_1.TokenType.RIGHT_BRACE ])) {
                let statement = this.statement();
                if (statement !== null) {
                    statements.push(statement);
                }
                else {
                    this.errors.push("While: Unexpected token:" +
                        this.peek().literal +
                        " at line: " +
                        this.peek().line.toString());
                    return null;
                }
            }
            if (!this.matchAdvance([ TokenType_1.TokenType.RIGHT_BRACE ])) {
                this.errors.push("Expected '}' at line: " + this.peek().line.toString());
                return null;
            }
            let body = this.toCompoundStatement(statements);
            return new ParseLoopStatement_1.ParseLoopStatement(null, expression, body, expression.lineNum);
        }
        this.errors.push("Expected '{' at line: " + this.peek().line.toString());
        return null;
    }
    for() {
        let initiator = null;
        if (this.match([
            TokenType_1.TokenType.INT,
            TokenType_1.TokenType.DOUBLE,
            TokenType_1.TokenType.BOOL,
            TokenType_1.TokenType.STRING
        ])) {
            initiator = this.declaration(false, false);
        }
        else if (this.match([ TokenType_1.TokenType.IDENTIFIER ])) {
            initiator = this.assignment();
        }
        else {
            this.errors.push("Expected declaration or assignment at line: " +
                this.peek().line.toString());
            return null;
        }
        if (!this.matchAdvance([ TokenType_1.TokenType.SEMICOLON ])) {
            this.errors.push("Expected ';' at line: " + this.peek().line.toString());
            return null;
        }
        let condition = this.expression();
        if (!this.matchAdvance([ TokenType_1.TokenType.SEMICOLON ])) {
            this.errors.push("Expected ';' at line: " + this.peek().line.toString());
            return null;
        }
        let assignment = this.statement();
        if (!this.matchAdvance([ TokenType_1.TokenType.RIGHT_PAREN ])) {
            this.errors.push("3_Expected ')' at line: " + this.peek().line.toString());
            return null;
        }
        if (initiator == null || assignment == null) {
            this.errors.push("Error in for loop");
            return null;
        }
        if (this.match([ TokenType_1.TokenType.LEFT_BRACE ])) {
            this.advance();
            let statements = [];
            while (!this.match([ TokenType_1.TokenType.RIGHT_BRACE ])) {
                let statement = this.statement();
                if (statement !== null) {
                    statements.push(statement);
                }
                else {
                    this.errors.push("ParseDeclaration: Unexpected token:" +
                        this.peek().literal +
                        " at line: " +
                        this.peek().line.toString());
                    return null;
                }
            }
            statements.push(assignment);
            let statement = this.toCompoundStatement(statements);
            if (!this.matchAdvance([ TokenType_1.TokenType.RIGHT_BRACE ])) {
                this.errors.push("Expected '}' at line: " + this.peek().line.toString());
                return null;
            }
            return new ParseLoopStatement_1.ParseLoopStatement(initiator, condition, statement, condition.lineNum);
        }
        this.errors.push("Expected '{' at line: " + this.peek().line.toString());
        return null;
    }
    assignment() {
        let identifier = this.identifier();
        if (identifier === null) {
            this.errors.push("Error in identifier");
            return null;
        }
        if (this.matchAdvance([ TokenType_1.TokenType.EQUAL ])) {
            let expression = this.expression();
            return new ParseAssignment_1.ParseAssignment(identifier, expression, identifier.lineNum);
        }
        this.errors.push("Assignment expected '=' at line: " + this.peek().line.toString());
        return null;
    }
    increment() {
        if (this.match([ TokenType_1.TokenType.IDENTIFIER ])) {
            let identifier = this.term();
            if (this.match([ TokenType_1.TokenType.INCREMENT, TokenType_1.TokenType.DECREMENT ])) {
                let operator = this.advance();
                return new ParseIncrement_1.ParseIncrement(identifier, operator.literal, identifier.lineNum);
            }
            this.errors.push("Increment expected '++' or '--' at line: " +
                this.peek().line.toString());
        }
        this.errors.push("ParseAssignment: Unexpected token: " +
            this.peek().literal +
            " at line: " +
            this.peek().line.toString());
        return null;
    }
    ifStatement() {
        this.advance();
        let ifToken = this.previous();
        this.matchAdvance([ TokenType_1.TokenType.LEFT_PAREN ]);
        let expr = this.expression();
        this.matchAdvance([ TokenType_1.TokenType.RIGHT_PAREN ]);
        if (this.matchAdvance([ TokenType_1.TokenType.LEFT_BRACE ])) {
            let body = this.block();
            let $else = null;
            if (this.matchAdvance([ TokenType_1.TokenType.ELSE ])) {
                if (this.matchAdvance([ TokenType_1.TokenType.LEFT_BRACE ])) {
                    $else = this.block();
                }
                else if (this.match([ TokenType_1.TokenType.IF ])) {
                    $else = this.ifStatement();
                }
            }
            return new ParseIfStatement_1.ParseIfStatement(expr, body, $else, ifToken.line);
        }
        this.errors.push("Expected '{' after if condition at line: " + this.peek().line.toString());
        return null;
    }
    block() {
        let statements = [];
        while (!this.match([ TokenType_1.TokenType.RIGHT_BRACE ]) && !this.isAtEnd()) {
            let statement = this.statement();
            if (statement !== null) {
                statements.push(statement);
            }
            else {
                this.errors.push("Block: Unexpected token:" +
                    this.peek().literal +
                    " at line: " +
                    this.peek().line.toString());
                return null;
            }
        }
        if (this.matchAdvance([ TokenType_1.TokenType.RIGHT_BRACE ])) {
            return this.toCompoundStatement(statements);
        }
        this.errors.push("Expected '}' at line: " + this.peek().line.toString());
        return null;
    }
    toCompoundStatement(statements) {
        if (statements.length === 1) {
            return statements[0];
        }
        return new ParseCompoundStatement_1.ParseCompoundStatement(statements[0], this.toCompoundStatement(statements.slice(1)), statements[0].lineNum);
    }
    functionDeclarationWithBody(exportStatement) {
        let functionDeclaration = this.functionDeclarationWithoutBody(exportStatement);
        if (functionDeclaration == null) {
            return null;
        }
        if (!this.matchAdvance([ TokenType_1.TokenType.LEFT_BRACE ])) {
            this.errors.push("Expected '{' at line: " + this.peek().line.toString());
            return null;
        }
        let bodyStatements = [];
        while (!this.match([ TokenType_1.TokenType.RIGHT_BRACE ])) {
            let statement = this.statement();
            if (statement !== null) {
                bodyStatements.push(statement);
            }
            else {
                this.errors.push("FunctionObject: Unexpected token:" +
                    this.peek().literal +
                    " at line: " +
                    this.peek().line.toString());
                return null;
            }
        }
        if (!this.matchAdvance([ TokenType_1.TokenType.RIGHT_BRACE ])) {
            this.errors.push("Expected '}' at line: " + this.peek().line.toString());
            return null;
        }
        functionDeclaration.body = this.toCompoundStatement(bodyStatements);
        return functionDeclaration;
    }
    functionDeclarationWithoutBody($export = false) {
        let returnType = this.type();
        if (returnType === null) {
            this.errors.push("Error in return type");
            return null;
        }
        let name = this.identifier();
        if (name === null) {
            this.errors.push("Error in function name");
            return null;
        }
        if (!this.matchAdvance([ TokenType_1.TokenType.LEFT_PAREN ])) {
            this.errors.push("Expected '(' at line: " + this.peek().line.toString());
            return null;
        }
        let parameters = new Map();
        while (!this.match([ TokenType_1.TokenType.RIGHT_PAREN ])) {
            let type = this.type();
            if (type === null) {
                this.errors.push("Error in type");
                return null;
            }
            let identifier = this.identifier();
            if (identifier === null) {
                this.errors.push("Error in identifier");
                return null;
            }
            parameters.set(identifier, type);
            if (this.matchAdvance([ TokenType_1.TokenType.COMMA ])) {
                continue;
            }
            break;
        }
        if (!this.matchAdvance([ TokenType_1.TokenType.RIGHT_PAREN ])) {
            this.errors.push("4_Expected ')' at line: " + this.peek().line.toString());
            return null;
        }
        return new ParseFunctionDeclaration_1.ParseFunctionDeclaration(returnType, name, parameters, null, $export, name.lineNum);
    }
    functionCallExpression(identifier) {
        let functionName = identifier;
        let actualParameters = [];
        while (!this.match([ TokenType_1.TokenType.RIGHT_PAREN ])) {
            let expression = this.expression();
            actualParameters.push(expression);
            if (this.matchAdvance([ TokenType_1.TokenType.COMMA ])) {
                continue;
            }
            break;
        }
        if (!this.matchAdvance([ TokenType_1.TokenType.RIGHT_PAREN ])) {
            this.errors.push("5_Expected ')' at line: " + this.peek().line.toString());
        }
        return new ParseFunctionCallExpression_1.ParseFunctionCallExpression(functionName.name, actualParameters, this.previous().line);
    }
    functionCallStatement() {
        let functionName = this.identifier();
        if (functionName === null) {
            this.errors.push("Error in function name");
        }
        this.advance();
        let actualParameters = [];
        while (!this.match([ TokenType_1.TokenType.RIGHT_PAREN ])) {
            let expression = this.expression();
            actualParameters.push(expression);
            if (this.matchAdvance([ TokenType_1.TokenType.COMMA ])) {
                continue;
            }
            break;
        }
        if (!this.matchAdvance([ TokenType_1.TokenType.RIGHT_PAREN ])) {
            this.errors.push("6_Expected ')' at line: " + this.peek().line.toString());
        }
        return new ParseFunctionCallStatement_1.ParseFunctionCallStatement(functionName.name, actualParameters, this.previous().line);
    }
    identifier() {
        if (this.matchAdvance([ TokenType_1.TokenType.IDENTIFIER ])) {
            return new ParseIdentifier_1.ParseIdentifier(this.previous(), this.previous().line);
        }
        this.errors.push("Expected identifier at line: " + this.peek().line.toString());
        return null;
    }
    return() {
        let expression = this.expression();
        return new ParseReturn_1.ParseReturn(expression, expression.lineNum);
    }
}
exports.Parser = Parser;

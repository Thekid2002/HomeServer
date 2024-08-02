import {Token} from "../Lexer/Token";
import {TokenType} from "../Lexer/TokenType";
import {ParseEqualityExpression} from "./Expressions/ParseEqualityExpression";
import {ParseRelationalExpression} from "./Expressions/ParseRelationalExpression";
import {ParseMultiplicativeExpression} from "./Expressions/ParseMultiplicativeExpression";
import {ParseUnaryExpression} from "./Expressions/ParseUnaryExpression";
import {ParseTerm} from "./Expressions/Terms/ParseTerm";
import {ParseNum} from "./Expressions/Terms/ParseNum";
import {ParseIdentifier} from "./Expressions/Terms/ParseIdentifier";
import {ParseExpression} from "./Expressions/ParseExpression";
import {AbstractTerm} from "./Expressions/Terms/AbstractTerm";
import {ParseAbstractExpression} from "./Expressions/ParseAbstractExpression";
import {ParsePowExpression} from "./Expressions/ParsePowExpression";
import {ParseAdditiveExpression} from "./Expressions/ParseAdditiveExpression";
import {ParseProgram} from "./Statements/ParseProgram";
import {ParseDeclaration} from "./Statements/ParseDeclaration";
import {ParseType} from "./Expressions/Terms/ParseType";
import {ParseAbstractStatement} from "./Statements/ParseAbstractStatement";
import {ParsePrint} from "./Statements/ParsePrint";
import {ParseLoopStatement} from "./Statements/ParseLoopStatement";
import {ParseAssignment} from "./Statements/ParseAssignment";
import {ParseIfStatement} from "./Statements/ParseIfStatement";
import {ParseCompoundStatement} from "./Statements/ParseCompoundStatement";
import {ParseString} from "./Expressions/Terms/ParseString";

export class Parser {
    tokens: Token[];
    current: i32 = 0;

    errors: string[] = [];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): ParseProgram | null {
        let prg = this.program();
        if (!this.isAtEnd()) {
            this.errors.push("Parse: Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
        }
        return prg;
    }

    private program(): ParseProgram | null {
        let statements: ParseAbstractStatement[] = [];

        while (!this.isAtEnd()) {
            let statement = this.statement();
            if (this.match([TokenType.SEMICOLON]) && !this.isAtEnd()) {
                this.advance();
            }
            if (statement !== null) {
                statements.push(statement);
            } else {
                this.errors.push("ParseProgram: Unexpected token:" + this.peek().literal + " at line: " + this.peek().line.toString());
                break;
            }
        }

        if (statements.length === 0) {
            return null;
        }
        let body = this.toCompoundStatement(statements);
        return new ParseProgram(body, statements[0].lineNum);
    }

    private statement(): ParseAbstractStatement | null {
        if (this.match([TokenType.IF])) {
            return this.ifStatement();
        }

        if (this.match([TokenType.PRINT])) {
            return this.print();
        }

        if (this.match([TokenType.NUM, TokenType.BOOL, TokenType.STRING])) {
            return this.declaration();
        }

        if (this.match([TokenType.IDENTIFIER])) {
            return this.assignment();
        }

        if (this.match([TokenType.WHILE, TokenType.FOR])) {
            return this.loop();
        }

        this.errors.push("Statement: Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
        return null;

    }


    private print(): ParsePrint | null {
        if (this.matchAdvance([TokenType.PRINT])) {
            let expression = this.expression();
            return new ParsePrint(expression, expression.lineNum);
        }

        this.errors.push("Expected 'print' at line: " + this.peek().line.toString());
        return null
    }


    private declaration(): ParseDeclaration | null {
        let type = this.type();
        if (type === null) {
            this.errors.push("Error in type");
            console.log("Error in type");
            return null;
        }
        if (!this.match([TokenType.IDENTIFIER])) {
            this.errors.push("ParseDeclaration: Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
            return null;
        }
        let identifier = this.term() as ParseIdentifier;
        let expression: ParseAbstractExpression | null = null;
        if (this.matchAdvance([TokenType.EQUAL])) {
            expression = this.expression();
        }
        return new ParseDeclaration(identifier, type, expression, identifier.lineNum);
    }

    private expression(): ParseExpression {
        let leftOrPrimary: ParseAbstractExpression = this.equalityExpression();
        let operator: Token | null = null;
        let right: ParseAbstractExpression | null = null;

        while (this.matchAdvance([TokenType.AND, TokenType.OR])) {
            operator = this.previous();
            right = this.equalityExpression();
            leftOrPrimary = new ParseExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if (leftOrPrimary instanceof ParseExpression) {
            return leftOrPrimary as ParseExpression;
        }

        return new ParseExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }

    private equalityExpression(): ParseEqualityExpression {
        let leftOrPrimary: ParseAbstractExpression = this.relationExpression();
        let operator: Token | null = null;
        let right: ParseAbstractExpression | null = null;

        while (this.matchAdvance([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
            operator = this.previous();
            right = this.relationExpression();
            leftOrPrimary = new ParseEqualityExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if (leftOrPrimary instanceof ParseEqualityExpression) {
            return leftOrPrimary as ParseEqualityExpression;
        }

        return new ParseEqualityExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }

    private relationExpression(): ParseRelationalExpression {
        let leftOrPrimary: ParseAbstractExpression = this.additiveExpression();
        let operator: Token | null = null;
        let right: ParseAbstractExpression | null = null;

        while (this.matchAdvance([TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL])) {
            operator = this.previous();
            right = this.additiveExpression();
            leftOrPrimary = new ParseRelationalExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if (leftOrPrimary instanceof ParseRelationalExpression) {
            return leftOrPrimary as ParseRelationalExpression;
        }

        return new ParseRelationalExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }

    private isAtEnd(): boolean {
        return this.tokens[this.current].type === TokenType.EOF;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    match(expected: TokenType[]): boolean {
        if (this.isAtEnd()) return false;

        for (let i = 0; i < expected.length; i++) {
            if (this.tokens[this.current].type === expected[i]) {
                return true;
            }
        }

        return false;
    }

    matchAdvance(expected: TokenType[]): boolean {
        if (this.isAtEnd()) return false;

        for (let i = 0; i < expected.length; i++) {
            if (this.tokens[this.current].type === expected[i]) {
                this.current++;
                return true;
            }
        }

        return false;
    }

    private additiveExpression(): ParseAdditiveExpression {
        let leftOrPrimary: ParseAbstractExpression = this.multExpression();
        let operator: Token | null = null;
        let right: ParseAbstractExpression | null = null;

        while (this.matchAdvance([TokenType.MINUS, TokenType.PLUS])) {
            operator = this.previous();
            right = this.multExpression();
            leftOrPrimary = new ParseAdditiveExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if (leftOrPrimary instanceof ParseAdditiveExpression) {
            return leftOrPrimary as ParseAdditiveExpression;
        }

        return new ParseAdditiveExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }

    private multExpression(): ParseMultiplicativeExpression {
        let leftOrPrimary: ParseAbstractExpression = this.powerExpression();
        let operator: Token | null = null;
        let right: ParseAbstractExpression | null = null;

        while (this.matchAdvance([TokenType.SLASH, TokenType.STAR, TokenType.MOD])) {
            operator = this.previous();
            right = this.powerExpression();
            leftOrPrimary = new ParseMultiplicativeExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if (leftOrPrimary instanceof ParseMultiplicativeExpression) {
            return leftOrPrimary as ParseMultiplicativeExpression;
        }

        return new ParseMultiplicativeExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }

    private powerExpression(): ParsePowExpression {
        let leftOrPrimary: ParseAbstractExpression = this.unaryExpression();
        let operator: Token | null = null;
        let right: ParseAbstractExpression | null = null;

        while (this.matchAdvance([TokenType.POW])) {
            operator = this.previous();
            right = this.unaryExpression();
            leftOrPrimary = new ParsePowExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if (leftOrPrimary instanceof ParsePowExpression) {
            return leftOrPrimary as ParsePowExpression;
        }

        return new ParsePowExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }

    private unaryExpression(): ParseUnaryExpression {
        if (this.matchAdvance([TokenType.LEFT_PAREN])) {
            let expr = this.expression();
            if (this.matchAdvance([TokenType.RIGHT_PAREN])) {
                return new ParseUnaryExpression(null, expr, expr.lineNum);
            }
            this.errors.push("Expected ')' at line: " + this.peek().line.toString());
            return new ParseUnaryExpression(null, new ParseTerm("ERROR", this.peek().line), this.peek().line);
        }

        let operator: Token | null = null;
        let rightOrPrimary: ParseAbstractExpression;

        if (this.matchAdvance([TokenType.BANG, TokenType.MINUS, TokenType.SIN, TokenType.SQRT, TokenType.TAN, TokenType.COS,
            TokenType.ASIN, TokenType.ACOS, TokenType.ATAN])) {
            operator = this.previous();
            rightOrPrimary = this.unaryExpression();
        } else {
            rightOrPrimary = this.term();
        }

        return new ParseUnaryExpression(operator, rightOrPrimary, rightOrPrimary.lineNum);
    }

    private type(): ParseType | null {
        if (this.matchAdvance([TokenType.NUM, TokenType.BOOL, TokenType.STRING])) {
            return new ParseType(this.previous(), this.previous().line);
        }

        if (!this.isAtEnd()) {
            this.errors.push("ParseType: Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
        } else {
            this.errors.push("ParseType: Unexpected end of input");
        }
        return null;
    }

    private term(): AbstractTerm {
        if (this.matchAdvance([TokenType.NUMBER])) {
            return new ParseNum(this.previous(), this.previous().line);
        }

        if (this.matchAdvance([TokenType.IDENTIFIER])) {
            return new ParseIdentifier(this.previous(), this.previous().line);
        }

        if (this.matchAdvance([TokenType.STRING])) {
            return new ParseString(this.previous(), this.previous().line);
        }

        if (!this.isAtEnd()) {
            this.errors.push("ParseTerm: Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
        } else {
            this.errors.push("ParseTerm: Unexpected end of input");
        }
        return new ParseTerm("ERROR", this.peek().line);
    }

    private loop(): ParseLoopStatement | null {
        if (this.matchAdvance([TokenType.WHILE])) {
            if (this.matchAdvance([TokenType.LEFT_PAREN])) {
                return this.while();
            }
            this.errors.push("Expected '(' at line: " + this.peek().line.toString());
        }
        if (this.matchAdvance([TokenType.FOR])) {
            if (this.matchAdvance([TokenType.LEFT_PAREN])) {
                return this.for();
            }
            this.errors.push("Expected '(' at line: " + this.peek().line.toString());
        }
        this.errors.push("Loop: Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
        return null;
    }


    private while(): ParseLoopStatement | null {
        let expression = this.expression();
        if (!this.matchAdvance([TokenType.RIGHT_PAREN])) {
            this.errors.push("Expected ')' at line: " + this.peek().line.toString());
            return null;
        }
        if (this.match([TokenType.LEFT_BRACE])) {
            this.advance();
            let statements: ParseAbstractStatement[] = [];
            while (!this.match([TokenType.RIGHT_BRACE])) {
                let statement = this.statement();
                if (statement !== null) {
                    statements.push(statement);
                } else {
                    this.errors.push("While: Unexpected token:" + this.peek().literal + " at line: " + this.peek().line.toString());
                    return null;
                }
            }
            if (!this.matchAdvance([TokenType.RIGHT_BRACE])) {
                this.errors.push("Expected '}' at line: " + this.peek().line.toString());
                return null;
            }
            let body = this.toCompoundStatement(statements);
            return new ParseLoopStatement(null, expression, body, expression.lineNum);
        }
        this.errors.push("Expected '{' at line: " + this.peek().line.toString());
        return null;
    }

    private for(): ParseLoopStatement | null {
        let declaration = this.declaration();
        if (!this.matchAdvance([TokenType.SEMICOLON])) {
            this.errors.push("Expected ';' at line: " + this.peek().line.toString());
            return null;
        }
        let expression = this.expression();
        if (!this.matchAdvance([TokenType.SEMICOLON])) {
            this.errors.push("Expected ';' at line: " + this.peek().line.toString());
            return null;
        }
        let assignment = this.assignment();
        if (!this.matchAdvance([TokenType.RIGHT_PAREN])) {
            this.errors.push("Expected ')' at line: " + this.peek().line.toString());
            return null;
        }
        if (declaration == null || assignment == null) {
            this.errors.push("Error in for loop");
            return null;
        }
        if (this.match([TokenType.LEFT_BRACE])) {
            this.advance();
            let statements: ParseAbstractStatement[] = [];
            while (!this.match([TokenType.RIGHT_BRACE])) {
                let statement = this.statement();
                if (statement !== null) {
                    statements.push(statement);
                } else {
                    this.errors.push("ParseDeclaration: Unexpected token:" + this.peek().literal + " at line: " + this.peek().line.toString());
                    return null;
                }
            }
            statements.push(assignment);
            let statement = this.toCompoundStatement(statements);
            if (!this.matchAdvance([TokenType.RIGHT_BRACE])) {
                this.errors.push("Expected '}' at line: " + this.peek().line.toString());
                return null;
            }
            return new ParseLoopStatement(declaration, expression, statement, expression.lineNum);
        }
        this.errors.push("Expected '{' at line: " + this.peek().line.toString());
        return null;
    }

    private assignment(): ParseAssignment | null {
        if (this.match([TokenType.IDENTIFIER])) {
            let identifier = this.term() as ParseIdentifier;

            if (this.matchAdvance([TokenType.EQUAL])) {
                let expression = this.expression();
                return new ParseAssignment(identifier, expression, identifier.lineNum);
            }
            this.errors.push("Expected '=' at line: " + this.peek().line.toString());
        }
        this.errors.push("ParseAssignment: Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());

        return null;

    }

    private ifStatement(): ParseIfStatement | null {
        this.advance();
        let ifToken = this.previous();
        let expr = this.expression();

        if (this.matchAdvance([TokenType.LEFT_BRACE])) {
            let body = this.block();
            let $else: ParseAbstractStatement | null = null;

            if (this.matchAdvance([TokenType.ELSE])) {
                if (this.matchAdvance([TokenType.LEFT_BRACE])) {
                    $else = this.block();
                } else if (this.match([TokenType.IF])) {
                    $else = this.ifStatement();
                }
            }

            return new ParseIfStatement(expr, body, $else, ifToken.line);
        }

        this.errors.push("Expected '{' after if condition at line: " + this.peek().line.toString());
        return null;
    }

    private block(): ParseAbstractStatement | null {
        let statements: ParseAbstractStatement[] = [];
        while (!this.match([TokenType.RIGHT_BRACE]) && !this.isAtEnd()) {
            let statement = this.statement();
            if (statement !== null) {
                statements.push(statement);
            } else {
                this.errors.push("Block: Unexpected token:" + this.peek().literal + " at line: " + this.peek().line.toString());
                return null;
            }
        }
        if (this.matchAdvance([TokenType.RIGHT_BRACE])) {
            return this.toCompoundStatement(statements);
        }
        this.errors.push("Expected '}' at line: " + this.peek().line.toString());
        return null;
    }

    private toCompoundStatement(statements: ParseAbstractStatement[]): ParseAbstractStatement {
        if (statements.length === 1) {
            return statements[0];
        }

        return new ParseCompoundStatement(statements[0], this.toCompoundStatement(statements.slice(1)), statements[0].lineNum);
    }

}



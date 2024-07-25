import {Token} from "../Lexer/Token";
import {TokenType} from "../Lexer/TokenType";
import {EqualityExpression} from "./Expressions/EqualityExpression";
import {RelationalExpression} from "./Expressions/RelationalExpression";
import {MultiplicativeExpression} from "./Expressions/MultiplicativeExpression";
import {UnaryExpression} from "./Expressions/UnaryExpression";
import {Term} from "./Expressions/Terms/Term";
import {Num} from "./Expressions/Terms/Num";
import {Identifier} from "./Expressions/Terms/Identifier";
import {Expression} from "./Expressions/Expression";
import {AbstractTerm} from "./Expressions/Terms/AbstractTerm";
import {AbstractExpression} from "./Expressions/AbstractExpression";
import {PowExpression} from "./Expressions/PowExpression";
import {AdditiveExpression} from "./Expressions/AdditiveExpression";
import {Program} from "./Statements/Program";
import {CompoundStatement} from "./Statements/CompoundStatement";
import {Declaration} from "./Statements/Declaration";
import {Type} from "./Expressions/Terms/Type";
import {AbstractStatement} from "./Statements/AbstractStatement";
import {Print} from "./Statements/Print";

export class Parser {
    tokens: Token[];
    current: i32 = 0;

    errors: string[] = [];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): Program | null {
        let prg = this.program();
        if (!this.isAtEnd()) {
            this.errors.push("Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
        }
        return prg;
    }

    private program(): Program | null{
        let statements: AbstractStatement[] = [];

        while (!this.isAtEnd()){
            let statement = this.statement();
            if(statement !== null){
                statements.push(statement);
            }else {
                this.errors.push("Unexpected token:" + this.peek().literal + " at line: " + this.peek().line.toString());
                break;
            }
        }

        let statement = this.toCompound(statements);

        return new Program(statement, statement.lineNum);
    }

    private toCompound(statements: AbstractStatement[]): AbstractStatement {
        if(statements.length === 1) {
            return statements[0];
        }

        return new CompoundStatement(statements[0], this.toCompound(statements.slice(1)), statements[0].lineNum);

    }

    private statement(): AbstractStatement | null {
        if (this.match([TokenType.PRINT])) {
            return this.print();
        }

        if (this.match([TokenType.NUM, TokenType.BOOL, TokenType.STRING])) {
            return this.declaration();
        }

        this.errors.push("Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
        return null;

    }


    private print(): Print | null {
        if (this.matchAdvance([TokenType.PRINT])) {
            let expression = this.expression();
            return new Print(expression, expression.lineNum);
        }

        this.errors.push("Expected 'print' at line: " + this.peek().line.toString());
        return null
    }


    private declaration(): Declaration | null {
        let type = this.type();
        if(type === null) {
            this.errors.push("Error in type");
            console.log("Error in type");
            return null;
        }
        let identifier = this.term() as Identifier;
        let expression: AbstractExpression | null = null;
        if(this.matchAdvance([TokenType.EQUAL])) {
            expression = this.expression();
        }
        return new Declaration(identifier, type, expression, identifier.lineNum);
    }

    private expression(): Expression {
        let leftOrPrimary: AbstractExpression = this.equalityExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        while (this.matchAdvance([TokenType.AND, TokenType.OR])) {
            operator = this.previous();
            right = this.equalityExpression();
            leftOrPrimary = new Expression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if(leftOrPrimary instanceof Expression){
            return leftOrPrimary as Expression;
        }

        return new Expression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }

    private  equalityExpression(): EqualityExpression {
        let leftOrPrimary: AbstractExpression = this.relationExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        while (this.matchAdvance([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
            operator = this.previous();
            right = this.relationExpression();
            leftOrPrimary = new EqualityExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if(leftOrPrimary instanceof EqualityExpression){
            return leftOrPrimary as EqualityExpression;
        }

        return new EqualityExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }

    private relationExpression(): RelationalExpression {
        let leftOrPrimary: AbstractExpression = this.additiveExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        while (this.matchAdvance([TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL])) {
            operator = this.previous();
            right = this.additiveExpression();
            leftOrPrimary = new RelationalExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if(leftOrPrimary instanceof RelationalExpression){
            return leftOrPrimary as RelationalExpression;
        }

        return new RelationalExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
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

    private additiveExpression(): AdditiveExpression {
        let leftOrPrimary: AbstractExpression = this.multExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        while (this.matchAdvance([TokenType.MINUS, TokenType.PLUS])) {
            operator = this.previous();
            right = this.multExpression();
            leftOrPrimary = new AdditiveExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if(leftOrPrimary instanceof AdditiveExpression){
            return leftOrPrimary as AdditiveExpression;
        }

        return new AdditiveExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }

    private multExpression(): MultiplicativeExpression {
        let leftOrPrimary: AbstractExpression = this.powerExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        while (this.matchAdvance([TokenType.SLASH, TokenType.STAR])) {
            operator = this.previous();
            right = this.powerExpression();
            leftOrPrimary = new MultiplicativeExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if(leftOrPrimary instanceof MultiplicativeExpression){
            return leftOrPrimary as MultiplicativeExpression;
        }

        return new MultiplicativeExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }

    private powerExpression(): PowExpression {
        let leftOrPrimary: AbstractExpression = this.unaryExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        while (this.matchAdvance([TokenType.POW])) {
            operator = this.previous();
            right = this.unaryExpression();
            leftOrPrimary = new PowExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
        }

        if(leftOrPrimary instanceof PowExpression){
            return leftOrPrimary as PowExpression;
        }

        return new PowExpression(leftOrPrimary, operator, right, leftOrPrimary.lineNum);
    }

    private unaryExpression(): UnaryExpression {
        if(this.matchAdvance([TokenType.LEFT_PAREN])) {
            let expr = this.expression();
            if(this.matchAdvance([TokenType.RIGHT_PAREN])) {
                return new UnaryExpression(null, expr, expr.lineNum);
            }
            this.errors.push("Expected ')' at line: " + this.peek().line.toString());
            return new UnaryExpression(null, new Term("ERROR", this.peek().line), this.peek().line);
        }

        let operator: Token | null = null;
        let rightOrPrimary: AbstractExpression;

        if (this.matchAdvance([TokenType.BANG, TokenType.MINUS, TokenType.SIN, TokenType.SQRT, TokenType.TAN, TokenType.COS,
            TokenType.ASIN, TokenType.ACOS, TokenType.ATAN])) {
            operator = this.previous();
            rightOrPrimary = this.unaryExpression();
        }else {
            rightOrPrimary = this.term();
        }

        return new UnaryExpression(operator, rightOrPrimary, rightOrPrimary.lineNum);
    }

    private type(): Type | null {
        if(this.matchAdvance([TokenType.NUM, TokenType.BOOL, TokenType.STRING])) {
            return new Type(this.previous(), this.previous().line);
        }

        if(!this.isAtEnd()) {
            this.errors.push("Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
            console.log("Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
        }else {
            this.errors.push("Unexpected end of input");
            console.log("Unexpected end of input");
        }
        return null;
    }

    private term(): AbstractTerm {
        if (this.matchAdvance([TokenType.NUMBER])) {
            return new Num(this.previous(), this.previous().line);
        }

        if(this.matchAdvance([TokenType.IDENTIFIER])) {
            return new Identifier(this.previous(), this.previous().line);
        }

        if(!this.isAtEnd()) {
            this.errors.push("Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
            console.log("Unexpected token: " + this.peek().literal + " at line: " + this.peek().line.toString());
        }else {
            this.errors.push("Unexpected end of input");
            console.log("Unexpected end of input");
        }
        return new Term("ERROR", this.peek().line);
    }
}

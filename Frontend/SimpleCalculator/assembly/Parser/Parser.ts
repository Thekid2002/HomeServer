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

export class Parser {
    tokens: Token[];
    current: i32 = 0;

    errors: string[] = [];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): AbstractExpression {
        let expr = this.expression();
        if (!this.isAtEnd()) {
            this.errors.push("Parse: Unexpected token: " + this.peek().literal! + " at line: " + this.peek().line.toString());
        }
        return expr;
    }

    private expression(): Expression {
        let leftOrPrimary: AbstractExpression = this.equalityExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        while (this.match([TokenType.AND, TokenType.OR])) {
            operator = this.previous();
            right = this.equalityExpression();
            leftOrPrimary = new Expression(leftOrPrimary, operator, right);
        }

        if (leftOrPrimary instanceof Expression) {
            return leftOrPrimary as Expression;
        }

        return new Expression(leftOrPrimary, operator, right);
    }

    private equalityExpression(): EqualityExpression {
        let leftOrPrimary: AbstractExpression = this.relationExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        while (this.match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
            operator = this.previous();
            right = this.relationExpression();
            leftOrPrimary = new EqualityExpression(leftOrPrimary, operator, right);
        }

        if (leftOrPrimary instanceof EqualityExpression) {
            return leftOrPrimary as EqualityExpression;
        }

        return new EqualityExpression(leftOrPrimary, operator, right);
    }

    private relationExpression(): RelationalExpression {
        let leftOrPrimary: AbstractExpression = this.additiveExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        while (this.match([TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL])) {
            operator = this.previous();
            right = this.additiveExpression();
            leftOrPrimary = new RelationalExpression(leftOrPrimary, operator, right);
        }

        if (leftOrPrimary instanceof RelationalExpression) {
            return leftOrPrimary as RelationalExpression;
        }

        return new RelationalExpression(leftOrPrimary, operator, right);
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

        while (this.match([TokenType.MINUS, TokenType.PLUS])) {
            operator = this.previous();
            right = this.multExpression();
            leftOrPrimary = new AdditiveExpression(leftOrPrimary, operator, right);
        }

        if (leftOrPrimary instanceof AdditiveExpression) {
            return leftOrPrimary as AdditiveExpression;
        }

        return new AdditiveExpression(leftOrPrimary, operator, right);
    }

    private multExpression(): MultiplicativeExpression {
        let leftOrPrimary: AbstractExpression = this.powerExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        while (this.match([TokenType.SLASH, TokenType.STAR])) {
            operator = this.previous();
            right = this.powerExpression();
            leftOrPrimary = new MultiplicativeExpression(leftOrPrimary, operator, right);
        }

        if (leftOrPrimary instanceof MultiplicativeExpression) {
            return leftOrPrimary as MultiplicativeExpression;
        }

        return new MultiplicativeExpression(leftOrPrimary, operator, right);
    }

    private powerExpression(): PowExpression {
        let left: AbstractExpression = this.unaryExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        while (this.match([TokenType.POW])) {
            operator = this.previous();
            right = this.unaryExpression();
            left = new PowExpression(left, operator, right);
        }

        if (left instanceof PowExpression) {
            return left as PowExpression;
        }

        return new PowExpression(left, operator, right);
    }

    private unaryExpression(): UnaryExpression {
        if (this.match([TokenType.LEFT_PAREN])) {
            let expr = this.expression();
            if (this.match([TokenType.RIGHT_PAREN])) {
                return new UnaryExpression(null, expr);
            }
            this.errors.push("Expected ')' at line: " + this.peek().line.toString());
            return new UnaryExpression(null, new Term("ERROR"));
        }

        let operator: Token | null = null;
        let rightOrPrimary: AbstractExpression;

        if (this.match([TokenType.BANG, TokenType.MINUS, TokenType.SIN, TokenType.SQRT, TokenType.TAN, TokenType.COS,
            TokenType.ASIN, TokenType.ACOS, TokenType.ATAN])) {
            operator = this.previous();
            rightOrPrimary = this.unaryExpression();
        } else {
            rightOrPrimary = this.term();
        }

        return new UnaryExpression(operator, rightOrPrimary);
    }

    private term(): AbstractTerm {

        if (this.match([TokenType.NUMBER])) {
            return new Num(this.previous());
        }

        if (this.match([TokenType.IDENTIFIER])) {
            return new Identifier(this.previous());
        }

        if (!this.isAtEnd()) {
            this.errors.push("Term: Unexpected token: " + this.peek().literal! + " at line: " + this.peek().line.toString());
        } else {
            this.errors.push("Unexpected end of input");
        }
        return new Term("ERROR");
    }
}

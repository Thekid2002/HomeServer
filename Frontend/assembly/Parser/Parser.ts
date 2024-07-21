import {Token} from "../Lexer/Token";
import {TokenType} from "../Lexer/TokenType";
import {BinaryExpression} from "./Expressions/BinaryExpression";
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

export class Parser {
    tokens: Token[];
    current: i32 = 0;

    errors: string[] = [];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): AbstractExpression {
        var expr = this.expression();
        if (!this.isAtEnd()) {
            this.errors.push("Unexpected token: " + this.peek().literal! + " at line: " + this.peek().line.toString());
        }
        return expr;
    }

    private expression(): Expression {
        let leftOrPrimary: EqualityExpression = this.equalityExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        if (this.match([TokenType.AND, TokenType.OR])) {
            operator = this.previous();
            right = this.expression();
            return new Expression(leftOrPrimary, operator, right);
        }

        return new Expression(leftOrPrimary, operator, right);
    }

    private equalityExpression(): EqualityExpression {
        let leftOrPrimary: RelationalExpression = this.relationExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        if (this.match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
            operator = this.previous();
            right = this.equalityExpression();
            return new EqualityExpression(leftOrPrimary, operator, right);
        }

        return new EqualityExpression(leftOrPrimary, operator, right);
    }

    private relationExpression(): RelationalExpression {
        let leftOrPrimary: BinaryExpression = this.binaryExpression();
        let operator: Token | null = null;
        let right: AbstractExpression | null = null;

        if (this.match([TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL])) {
            operator = this.previous();
            right = this.relationExpression();
            return new RelationalExpression(leftOrPrimary, operator, right);
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

    private binaryExpression(): BinaryExpression {
        let leftOrPrimary: MultiplicativeExpression = this.multExpression();
        let operator: Token | null = null;
        let right: BinaryExpression | null = null;

        if (this.match([TokenType.MINUS, TokenType.PLUS])) {
            operator = this.previous();
            right = this.binaryExpression();
        }

        return new BinaryExpression(leftOrPrimary, operator, right);
    }

    private multExpression(): MultiplicativeExpression {
        let left: PowExpression = this.powerExpression();
        let operator: Token | null = null;
        let right: MultiplicativeExpression | null = null;

        if (this.match([TokenType.SLASH, TokenType.STAR])) {
            operator = this.previous();
            right = this.multExpression();
        }

        return new MultiplicativeExpression(left, operator, right);
    }

    private powerExpression(): PowExpression {
        let left: UnaryExpression = this.unaryExpression();
        let operator: Token | null = null;
        let right: PowExpression | null = null;

        if (this.match([TokenType.POW])) {
            operator = this.previous();
            right = this.powerExpression();
        }

        return new PowExpression(left, operator, right);
    }

    private unaryExpression(): UnaryExpression {
        if(this.match([TokenType.LEFT_PAREN])) {
            let expr = this.expression();
            if(this.match([TokenType.RIGHT_PAREN])) {
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
        }else {
            rightOrPrimary = this.term();
        }

        return new UnaryExpression(operator, rightOrPrimary);
    }

    private term(): AbstractTerm {

        if (this.match([TokenType.NUMBER])) {
            return new Num(this.previous());
        }

        if(this.match([TokenType.IDENTIFIER])) {
            return new Identifier(this.previous());
        }

        this.errors.push("Unexpected token: " + this.peek().literal! + " at line: " + this.peek().line.toString());
        return new Term("ERROR");
    }
}

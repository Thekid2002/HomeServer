"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const Token_1 = require("./Token");
const TokenType_1 = require("./TokenType");
const ReservedWords_1 = require("./ReservedWords");
class Scanner {
    constructor(source) {
        this.tokens = [];
        this.current = 0;
        this.start = 0;
        this.line = 1;
        this.errors = [];
        this.source = source;
    }
    isAtEnd() {
        return this.source.length <= this.current;
    }
    isDigit(c) {
        return (c == "0" ||
            c == "1" ||
            c == "2" ||
            c == "3" ||
            c == "4" ||
            c == "5" ||
            c == "6" ||
            c == "7" ||
            c == "8" ||
            c == "9");
    }
    isSmallLetter(c) {
        return (c == "a" ||
            c == "b" ||
            c == "c" ||
            c == "d" ||
            c == "e" ||
            c == "f" ||
            c == "g" ||
            c == "h" ||
            c == "i" ||
            c == "j" ||
            c == "k" ||
            c == "l" ||
            c == "m" ||
            c == "n" ||
            c == "o" ||
            c == "p" ||
            c == "q" ||
            c == "r" ||
            c == "s" ||
            c == "t" ||
            c == "u" ||
            c == "v" ||
            c == "w" ||
            c == "x" ||
            c == "y" ||
            c == "z");
    }
    isCapitalLetter(c) {
        return (c == "A" ||
            c == "B" ||
            c == "C" ||
            c == "D" ||
            c == "E" ||
            c == "F" ||
            c == "G" ||
            c == "H" ||
            c == "I" ||
            c == "J" ||
            c == "K" ||
            c == "L" ||
            c == "M" ||
            c == "N" ||
            c == "O" ||
            c == "P" ||
            c == "Q" ||
            c == "R" ||
            c == "S" ||
            c == "T" ||
            c == "U" ||
            c == "V" ||
            c == "W" ||
            c == "X" ||
            c == "Y" ||
            c == "Z");
    }
    isAlpha(c) {
        return c == "_" || this.isSmallLetter(c) || this.isCapitalLetter(c);
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token_1.Token(TokenType_1.TokenType.EOF, "", "", this.current));
        return this.tokens;
    }
    scanToken() {
        let c = this.advance();
        this.charSwitch(c);
    }
    advance() {
        return this.source.charAt(this.current++);
    }
    peak() {
        if (this.isAtEnd())
            return "\0";
        return this.source.charAt(this.current);
    }
    addToken(type, literal) {
        let text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token_1.Token(type, text, literal, this.line));
    }
    match(expected) {
        if (this.isAtEnd())
            return false;
        if (this.source.charAt(this.current) != expected)
            return false;
        this.current++;
        return true;
    }
    number() {
        while (this.isDigit(this.peak())) {
            this.advance();
        }
        if (this.peak() == "." &&
            this.isDigit(this.source.charAt(this.current + 1))) {
            this.advance();
            while (this.isDigit(this.peak())) {
                this.advance();
            }
            return this.addToken(TokenType_1.TokenType.DOUBLE_LITERAL, this.source.substring(this.start, this.current));
        }
        return this.addToken(TokenType_1.TokenType.INT_LITERAL, this.source.substring(this.start, this.current));
    }
    identifier() {
        while (this.isAlpha(this.peak()) || this.isDigit(this.peak())) {
            this.advance();
        }
        if (ReservedWords_1.ReservedWords.has(this.source.substring(this.start, this.current))) {
            this.addToken(ReservedWords_1.ReservedWords.get(this.source.substring(this.start, this.current)), this.source.substring(this.start, this.current));
            return;
        }
        this.addToken(TokenType_1.TokenType.IDENTIFIER, this.source.substring(this.start, this.current));
    }
    charSwitch(c) {
        if (this.isDigit(c)) {
            return this.number();
        }
        if (this.isAlpha(c)) {
            return this.identifier();
        }
        if (c == " ") {
            return;
        }
        if (c == "^") {
            return this.addToken(TokenType_1.TokenType.POW, "^");
        }
        if (c == "(") {
            return this.addToken(TokenType_1.TokenType.LEFT_PAREN, "(");
        }
        if (c == ")") {
            return this.addToken(TokenType_1.TokenType.RIGHT_PAREN, ")");
        }
        if (c == "{") {
            return this.addToken(TokenType_1.TokenType.LEFT_BRACE, "{");
        }
        if (c == "}") {
            return this.addToken(TokenType_1.TokenType.RIGHT_BRACE, "}");
        }
        if (c == ",") {
            return this.addToken(TokenType_1.TokenType.COMMA, ",");
        }
        if (c == ".") {
            return this.addToken(TokenType_1.TokenType.DOT, ".");
        }
        if (c == "-") {
            if (this.match("-")) {
                return this.addToken(TokenType_1.TokenType.DECREMENT, "--");
            }
            return this.addToken(TokenType_1.TokenType.MINUS, "-");
        }
        if (c == "+") {
            if (this.match("+")) {
                return this.addToken(TokenType_1.TokenType.INCREMENT, "++");
            }
            return this.addToken(TokenType_1.TokenType.PLUS, "+");
        }
        if (c == ";") {
            return this.addToken(TokenType_1.TokenType.SEMICOLON, ";");
        }
        if (c == "*") {
            return this.addToken(TokenType_1.TokenType.STAR, "*");
        }
        if (c == "\"") {
            while (this.source.charAt(this.current) != "\"" && !this.isAtEnd()) {
                if (this.source.charAt(this.current) == "\n") {
                    this.line++;
                }
                this.current++;
            }
            if (this.isAtEnd()) {
                this.errors.push("Unterminated string at line " + this.line.toString());
                return;
            }
            this.current++;
            this.addToken(TokenType_1.TokenType.STRING_LITERAL, this.source.substring(this.start + 1, this.current - 1));
            return;
        }
        if (c == "\n") {
            this.line++;
            return;
        }
        if (c == "&") {
            if (this.match("&")) {
                return this.addToken(TokenType_1.TokenType.AND, "&&");
            }
        }
        if (c == "|") {
            if (this.match("|")) {
                return this.addToken(TokenType_1.TokenType.OR, "||");
            }
        }
        if (c == "!") {
            if (this.match("=")) {
                return this.addToken(TokenType_1.TokenType.BANG_EQUAL, "!=");
            }
            return this.addToken(TokenType_1.TokenType.BANG, "!");
        }
        if (c == "=") {
            if (this.match("=")) {
                return this.addToken(TokenType_1.TokenType.EQUAL_EQUAL, "==");
            }
            return this.addToken(TokenType_1.TokenType.EQUAL, "=");
        }
        if (c == "<") {
            if (this.match("=")) {
                return this.addToken(TokenType_1.TokenType.LESS_EQUAL, "<=");
            }
            return this.addToken(TokenType_1.TokenType.LESS, "<");
        }
        if (c == ">") {
            if (this.match("=")) {
                return this.addToken(TokenType_1.TokenType.GREATER_EQUAL, ">=");
            }
            return this.addToken(TokenType_1.TokenType.GREATER, ">");
        }
        if (c == "/") {
            if (this.match("/")) {
                while (this.source.charAt(this.current) != "\n" && !this.isAtEnd()) {
                    this.current++;
                }
                return;
            }
            if (this.match("*")) {
                while (this.source.charAt(this.current) != "*" &&
                    this.source.charAt(this.current + 1) != "/" &&
                    !this.isAtEnd()) {
                    if (this.source.charAt(this.current) == "\n") {
                        this.line++;
                    }
                    this.current++;
                }
                this.current += 2;
                return;
            }
            return this.addToken(TokenType_1.TokenType.SLASH, "/");
        }
        if (c == "%") {
            return this.addToken(TokenType_1.TokenType.MOD, "%");
        }
        this.errors.push("Unexpected character: " + c + " at line " + this.line.toString());
    }
}
exports.Scanner = Scanner;

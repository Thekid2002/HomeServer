import { Token } from "./Token";
import { TokenType } from "./TokenType";
import { ReservedWords } from "./ReservedWords";

export class Scanner {
    source: string;
    tokens: Token[] = [];
    current: i32 = 0;
    start: i32 = 0;
    line: i32 = 1;
    errors: string[] = [];

    constructor(source: string) {
        this.source = source;
    }

    isAtEnd(): boolean {
        return this.source.length <= this.current;
    }

    isDigit(c: string): boolean {
        return (
            c == "0" ||
      c == "1" ||
      c == "2" ||
      c == "3" ||
      c == "4" ||
      c == "5" ||
      c == "6" ||
      c == "7" ||
      c == "8" ||
      c == "9"
        );
    }

    isSmallLetter(c: string): boolean {
        return (
            c == "a" ||
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
      c == "z"
        );
    }

    isCapitalLetter(c: string): boolean {
        return (
            c == "A" ||
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
      c == "Z"
        );
    }

    isAlpha(c: string): boolean {
        return c == "_" || this.isSmallLetter(c) || this.isCapitalLetter(c);
    }

    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, "", "", this.current));
        return this.tokens;
    }

    scanToken(): void {
        const c: string = this.advance();
        this.charSwitch(c);
    }

    advance(): string {
        return this.source.charAt(this.current++);
    }

    peak(): string {
        if (this.isAtEnd()) return "\0";
        return this.source.charAt(this.current);
    }

    addToken(type: TokenType, literal: string): void {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }

    match(expected: string): boolean {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) != expected) return false;

        this.current++;
        return true;
    }

    number(): void {
        while (this.isDigit(this.peak())) {
            this.advance();
        }

        if (
            this.peak() == "." &&
      this.isDigit(this.source.charAt(this.current + 1))
        ) {
            this.advance();
            while (this.isDigit(this.peak())) {
                this.advance();
            }
            return this.addToken(
                TokenType.DOUBLE_LITERAL,
                this.source.substring(this.start, this.current)
            );
        }

        return this.addToken(
            TokenType.INT_LITERAL,
            this.source.substring(this.start, this.current)
        );
    }

    identifier(): void {
        while (this.isAlpha(this.peak()) || this.isDigit(this.peak())) {
            this.advance();
        }

        if (ReservedWords.has(this.source.substring(this.start, this.current))) {
            this.addToken(
                ReservedWords.get(this.source.substring(this.start, this.current)),
                this.source.substring(this.start, this.current)
            );
            return;
        }

        this.addToken(
            TokenType.IDENTIFIER,
            this.source.substring(this.start, this.current)
        );
    }

    charSwitch(c: string): void {
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
            return this.addToken(TokenType.POW, "^");
        }

        if (c == "(") {
            return this.addToken(TokenType.LEFT_PAREN, "(");
        }
        if (c == ")") {
            return this.addToken(TokenType.RIGHT_PAREN, ")");
        }
        if (c == "{") {
            return this.addToken(TokenType.LEFT_BRACE, "{");
        }
        if (c == "}") {
            return this.addToken(TokenType.RIGHT_BRACE, "}");
        }
        if (c == ",") {
            return this.addToken(TokenType.COMMA, ",");
        }
        if (c == ".") {
            return this.addToken(TokenType.DOT, ".");
        }
        if (c == "-") {
            if (this.match("-")) {
                return this.addToken(TokenType.DECREMENT, "--");
            }
            return this.addToken(TokenType.MINUS, "-");
        }
        if (c == "+") {
            if (this.match("+")) {
                return this.addToken(TokenType.INCREMENT, "++");
            }
            return this.addToken(TokenType.PLUS, "+");
        }
        if (c == ";") {
            return this.addToken(TokenType.SEMICOLON, ";");
        }
        if (c == "*") {
            return this.addToken(TokenType.STAR, "*");
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
            this.addToken(
                TokenType.STRING_LITERAL,
                this.source.substring(this.start + 1, this.current - 1)
            );
            return;
        }
        if (c == "\n") {
            this.line++;
            return;
        }
        if (c == "&") {
            if (this.match("&")) {
                return this.addToken(TokenType.AND, "&&");
            }
        }
        if (c == "|") {
            if (this.match("|")) {
                return this.addToken(TokenType.OR, "||");
            }
        }
        if (c == "!") {
            if (this.match("=")) {
                return this.addToken(TokenType.BANG_EQUAL, "!=");
            }
            return this.addToken(TokenType.BANG, "!");
        }
        if (c == "=") {
            if (this.match("=")) {
                return this.addToken(TokenType.EQUAL_EQUAL, "==");
            }
            return this.addToken(TokenType.EQUAL, "=");
        }
        if (c == "<") {
            if (this.match("=")) {
                return this.addToken(TokenType.LESS_EQUAL, "<=");
            }
            return this.addToken(TokenType.LESS, "<");
        }
        if (c == ">") {
            if (this.match("=")) {
                return this.addToken(TokenType.GREATER_EQUAL, ">=");
            }
            return this.addToken(TokenType.GREATER, ">");
        }
        if (c == "/") {
            if (this.match("/")) {
                while (this.source.charAt(this.current) != "\n" && !this.isAtEnd()) {
                    this.current++;
                }
                return;
            }
            if (this.match("*")) {
                while (
                    this.source.charAt(this.current) != "*" &&
          this.source.charAt(this.current + 1) != "/" &&
          !this.isAtEnd()
                ) {
                    if (this.source.charAt(this.current) == "\n") {
                        this.line++;
                    }
                    this.current++;
                }
                this.current += 2;
                return;
            }
            return this.addToken(TokenType.SLASH, "/");
        }
        if (c == "%") {
            return this.addToken(TokenType.MOD, "%");
        }

        this.errors.push(
            "Unexpected character: " + c + " at line " + this.line.toString()
        );
    }
}

import {TokenType, TokenTypes} from "./TokenType";

export class Token {
    type: i32;
    lexeme: string;
    literal: string | null;
    line: i32;

    constructor(type: i32, lexeme: string, literal: string | null, line: i32) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    toString(): string {
        return " " + TokenTypes[this.type] + " " + this.lexeme + " " + (this.literal != null ? this.literal!.toString() : "");
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const TokenType_1 = require("./TokenType");
class Token {
    constructor(type, lexeme, literal, line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }
    toString() {
        return (" " +
            TokenType_1.TokenTypes[this.type] +
            " " +
            this.lexeme +
            " " +
            (this.literal != null ? this.literal.toString() : ""));
    }
    toJsonString() {
        return ("{ \"type\": \"" +
            TokenType_1.TokenTypes[this.type] +
            "\", \"lexeme\": \"" +
            this.lexeme.replaceAll("\"", "\\\"") +
            "\", \"literal\": \"" +
            this.literal +
            "\", \"line\": " +
            this.line.toString() +
            "}");
    }
}
exports.Token = Token;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenTypes = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    // Single-character tokens.
    TokenType[TokenType["LEFT_PAREN"] = 0] = "LEFT_PAREN";
    TokenType[TokenType["RIGHT_PAREN"] = 1] = "RIGHT_PAREN";
    TokenType[TokenType["LEFT_BRACE"] = 2] = "LEFT_BRACE";
    TokenType[TokenType["RIGHT_BRACE"] = 3] = "RIGHT_BRACE";
    TokenType[TokenType["LEFT_BRACKET"] = 4] = "LEFT_BRACKET";
    TokenType[TokenType["RIGHT_BRACKET"] = 5] = "RIGHT_BRACKET";
    TokenType[TokenType["COMMA"] = 6] = "COMMA";
    TokenType[TokenType["DOT"] = 7] = "DOT";
    TokenType[TokenType["MINUS"] = 8] = "MINUS";
    TokenType[TokenType["PLUS"] = 9] = "PLUS";
    TokenType[TokenType["SEMICOLON"] = 10] = "SEMICOLON";
    TokenType[TokenType["SLASH"] = 11] = "SLASH";
    TokenType[TokenType["STAR"] = 12] = "STAR";
    TokenType[TokenType["POW"] = 13] = "POW";
    TokenType[TokenType["MOD"] = 14] = "MOD";
    //Loops
    TokenType[TokenType["WHILE"] = 15] = "WHILE";
    TokenType[TokenType["FOR"] = 16] = "FOR";
    // Conditional
    TokenType[TokenType["IF"] = 17] = "IF";
    TokenType[TokenType["ELSE"] = 18] = "ELSE";
    // One or two character tokens.
    TokenType[TokenType["BANG"] = 19] = "BANG";
    TokenType[TokenType["BANG_EQUAL"] = 20] = "BANG_EQUAL";
    TokenType[TokenType["EQUAL"] = 21] = "EQUAL";
    TokenType[TokenType["EQUAL_EQUAL"] = 22] = "EQUAL_EQUAL";
    TokenType[TokenType["GREATER"] = 23] = "GREATER";
    TokenType[TokenType["GREATER_EQUAL"] = 24] = "GREATER_EQUAL";
    TokenType[TokenType["LESS"] = 25] = "LESS";
    TokenType[TokenType["LESS_EQUAL"] = 26] = "LESS_EQUAL";
    TokenType[TokenType["INCREMENT"] = 27] = "INCREMENT";
    TokenType[TokenType["DECREMENT"] = 28] = "DECREMENT";
    // Literals
    TokenType[TokenType["IDENTIFIER"] = 29] = "IDENTIFIER";
    TokenType[TokenType["STRING_LITERAL"] = 30] = "STRING_LITERAL";
    TokenType[TokenType["INT_LITERAL"] = 31] = "INT_LITERAL";
    TokenType[TokenType["DOUBLE_LITERAL"] = 32] = "DOUBLE_LITERAL";
    // Types
    TokenType[TokenType["INT"] = 33] = "INT";
    TokenType[TokenType["DOUBLE"] = 34] = "DOUBLE";
    TokenType[TokenType["BOOL"] = 35] = "BOOL";
    TokenType[TokenType["STRING"] = 36] = "STRING";
    TokenType[TokenType["VOID"] = 37] = "VOID";
    // Boolean
    TokenType[TokenType["TRUE"] = 38] = "TRUE";
    TokenType[TokenType["FALSE"] = 39] = "FALSE";
    // Keywords.
    TokenType[TokenType["SIN"] = 40] = "SIN";
    TokenType[TokenType["COS"] = 41] = "COS";
    TokenType[TokenType["TAN"] = 42] = "TAN";
    TokenType[TokenType["ASIN"] = 43] = "ASIN";
    TokenType[TokenType["ACOS"] = 44] = "ACOS";
    TokenType[TokenType["ATAN"] = 45] = "ATAN";
    TokenType[TokenType["SQRT"] = 46] = "SQRT";
    TokenType[TokenType["AND"] = 47] = "AND";
    TokenType[TokenType["CLASS"] = 48] = "CLASS";
    TokenType[TokenType["FUN"] = 49] = "FUN";
    TokenType[TokenType["NIL"] = 50] = "NIL";
    TokenType[TokenType["OR"] = 51] = "OR";
    TokenType[TokenType["RETURN"] = 52] = "RETURN";
    TokenType[TokenType["SUPER"] = 53] = "SUPER";
    TokenType[TokenType["THIS"] = 54] = "THIS";
    TokenType[TokenType["VAR"] = 55] = "VAR";
    TokenType[TokenType["EXPORT"] = 56] = "EXPORT";
    TokenType[TokenType["IMPORT"] = 57] = "IMPORT";
    TokenType[TokenType["FROM"] = 58] = "FROM";
    //Comment
    TokenType[TokenType["COMMENT"] = 59] = "COMMENT";
    TokenType[TokenType["EOF"] = 60] = "EOF";
})(TokenType || (exports.TokenType = TokenType = {}));
exports.TokenTypes = [
    // Single-character tokens.
    "LEFT_PAREN", // (
    "RIGHT_PAREN", // )
    "LEFT_BRACE", // {
    "RIGHT_BRACE", // }
    "LEFT_BRACKET", // [
    "RIGHT_BRACKET", // ]
    "COMMA", // ,
    "DOT", // .
    "MINUS", // -
    "PLUS", // +
    "SEMICOLON", // ;
    "SLASH", // /
    "STAR", // *
    "POW", // ^
    "MOD", // %
    //Loops
    "WHILE", // while
    "FOR", // for
    // Conditional
    "IF", // if
    "ELSE", // else
    // One or two character tokens.
    "BANG", // !
    "BANG_EQUAL", // !=
    "EQUAL", // =
    "EQUAL_EQUAL", // ==
    "GREATER", // >
    "GREATER_EQUAL", // >=
    "LESS", // <
    "LESS_EQUAL", // <=
    "INCREMENT", // ++
    "DECREMENT", // --
    // Literals
    "IDENTIFIER", // identifier
    "STRING_LITERAL", // string literal
    "INT_LITERAL", // int literal
    "DOUBLE_LITERAL", // double literal
    // Types
    "INT", // int
    "DOUBLE", // double
    "BOOL", // bool
    "STRING", // string
    "VOID", // void
    // Boolean
    "TRUE", // true
    "FALSE", // false
    // Keywords.
    "SIN", // sin
    "COS", // cos
    "TAN", // tan
    "ASIN", // asin
    "ACOS", // acos
    "ATAN", // atan
    "SQRT", // sqrt
    "AND", // and
    "CLASS", // class
    "FUN", // fun
    "NIL", // nil
    "OR", // or
    "RETURN", // return
    "SUPER", // super
    "THIS", // this
    "VAR", // var
    "EXPORT", // export
    "IMPORT", // import
    "FROM", // from
    //Comment
    "COMMENT", // comment
    "EOF" // end of file
];

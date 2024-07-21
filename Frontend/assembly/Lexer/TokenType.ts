export enum TokenType {
    // Single-character tokens.
    LEFT_PAREN,    // (
    RIGHT_PAREN,   // )
    LEFT_BRACE,    // {
    RIGHT_BRACE,   // }
    COMMA,         // ,
    DOT,           // .
    MINUS,         // -
    PLUS,          // +
    SEMICOLON,     // ;
    SLASH,         // /
    STAR,         // *
    POW,          // ^

    // One or two character tokens.
    BANG,         // !
    BANG_EQUAL,   // !=
    EQUAL,        // =
    EQUAL_EQUAL,  // ==
    GREATER,      // >
    GREATER_EQUAL,// >=
    LESS,         // <
    LESS_EQUAL,   // <=

    // Literals.
    IDENTIFIER,   // identifier
    STRING,       // string
    NUMBER,       // number

    // Keywords.
    SIN,          // sin
    COS,          // cos
    TAN,          // tan
    ASIN,         // asin
    ACOS,         // acos
    ATAN,         // atan
    SQRT,         // sqrt
    AND,          // and
    CLASS,        // class
    ELSE,         // else
    FALSE,        // false
    FUN,          // fun
    FOR,          // for
    IF,           // if
    NIL,          // nil
    OR,           // or
    PRINT,        // print
    RETURN,       // return
    SUPER,        // super
    THIS,         // this
    TRUE,         // true
    VAR,          // var
    WHILE,        // while

    EOF          // end of file
}

export const TokenTypes: string[] = [
    // Single-character tokens.
    "LEFT_PAREN",    // (
    "RIGHT_PAREN",   // )
    "LEFT_BRACE",    // {
    "RIGHT_BRACE",   // }
    "COMMA",         // ,
    "DOT",           // .
    "MINUS",         // -
    "PLUS",          // +
    "SEMICOLON",     // ;
    "SLASH",         // /
    "STAR",         // *
    "POW",          // ^

    // One or two character tokens.
    "BANG",         // !
    "BANG_EQUAL",   // !=
    "EQUAL",        // =
    "EQUAL_EQUAL",  // ==
    "GREATER",      // >
    "GREATER_EQUAL",// >=
    "LESS",         // <
    "LESS_EQUAL",   // <=

    // Literals.
    "IDENTIFIER",   // identifier
    "STRING",       // string
    "NUMBER",       // number

    // Keywords.
    "SIN",          // sin
    "COS",          // cos
    "TAN",          // tan
    "ASIN",         // asin
    "ACOS",         // acos
    "ATAN",         // atan
    "SQRT",         // sqrt
    "AND",          // and
    "CLASS",        // class
    "ELSE",         // else
    "FALSE",        // false
    "FUN",          // fun
    "FOR",          // for
    "IF",           // if
    "NIL",          // nil
    "OR",           // or
    "PRINT",        // print
    "RETURN",       // return
    "SUPER",        // super
    "THIS",         // this
    "TRUE",         // true
    "VAR",          // var
    "WHILE",        // while

    "EOF"          // end of file
];

export enum TokenType {
    // Single-character tokens.
    LEFT_PAREN,    // (
    RIGHT_PAREN,   // )
    LEFT_BRACE,    // {
    RIGHT_BRACE,   // }
    LEFT_BRACKET,  // [
    RIGHT_BRACKET, // ]
    COMMA,         // ,
    DOT,           // .
    MINUS,         // -
    PLUS,          // +
    SEMICOLON,     // ;
    SLASH,         // /
    STAR,         // *
    POW,          // ^
    MOD,          // %

    //Loops
    WHILE,        // while
    FOR,          // for

    // Conditional
    IF,           // if
    ELSE,         // else

    // One or two character tokens.
    BANG,         // !
    BANG_EQUAL,   // !=
    EQUAL,        // =
    EQUAL_EQUAL,  // ==
    GREATER,      // >
    GREATER_EQUAL,// >=
    LESS,         // <
    LESS_EQUAL,   // <=
    INCREMENT,    // ++
    DECREMENT,    // --

    // Literals
    IDENTIFIER,   // identifier
    STRING_LITERAL, // string literal
    NUMBER_LITERAL,  // number literal

    // Scan and print
    SCAN,         // scan
    PRINT,        // print

    // Types
    NUM,          // num
    BOOL,         // bool
    STRING,       // string
    VOID,         // void

    // Boolean
    TRUE,         // true
    FALSE,        // false

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
    FUN,          // fun
    NIL,          // nil
    OR,           // or
    RETURN,       // return
    SUPER,        // super
    THIS,         // this
    VAR,          // var
    EXPORT,       // export

    //Comment
    COMMENT,      // comment

    EOF          // end of file
}

export const TokenTypes: string[] = [
    // Single-character tokens.
    "LEFT_PAREN",    // (
    "RIGHT_PAREN",   // )
    "LEFT_BRACE",    // {
    "RIGHT_BRACE",   // }
    "LEFT_BRACKET",  // [
    "RIGHT_BRACKET", // ]
    "COMMA",         // ,
    "DOT",           // .
    "MINUS",         // -
    "PLUS",          // +
    "SEMICOLON",     // ;
    "SLASH",         // /
    "STAR",          // *
    "POW",           // ^
    "MOD",           // %

    //Loops
    "WHILE",         // while
    "FOR",           // for

    // Conditional
    "IF",           // if
    "ELSE",         // else

    // One or two character tokens.
    "BANG",         // !
    "BANG_EQUAL",   // !=
    "EQUAL",        // =
    "EQUAL_EQUAL",  // ==
    "GREATER",      // >
    "GREATER_EQUAL",// >=
    "LESS",         // <
    "LESS_EQUAL",   // <=
    "INCREMENT",    // ++
    "DECREMENT",    // --

    // Literals
    "IDENTIFIER",   // identifier
    "STRING_LITERAL", // string literal
    "NUMBER_LITERAL",  // number literal

    // Scan and print
    "SCAN",         // scan
    "PRINT",        // print

    // Types
    "NUM",          // num
    "BOOL",         // bool
    "STRING",       // string
    "VOID",         // void

    // Boolean
    "TRUE",         // true
    "FALSE",        // false

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
    "FUN",          // fun
    "NIL",          // nil
    "OR",           // or
    "RETURN",       // return
    "SUPER",        // super
    "THIS",         // this
    "VAR",          // var
    "EXPORT",       // export

    //Comment
    "COMMENT",      // comment

    "EOF"          // end of file
];

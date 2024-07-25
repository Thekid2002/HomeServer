import { TokenType } from "./TokenType";

export const ReservedWords: Map<string, i32> = new Map<string, i32>();

ReservedWords.set("and", TokenType.AND);
ReservedWords.set("class", TokenType.CLASS);
ReservedWords.set("else", TokenType.ELSE);
ReservedWords.set("false", TokenType.FALSE);
ReservedWords.set("fun", TokenType.FUN);
ReservedWords.set("num", TokenType.NUMBER);
ReservedWords.set("for", TokenType.FOR);
ReservedWords.set("if", TokenType.IF);
ReservedWords.set("nil", TokenType.NIL);
ReservedWords.set("or", TokenType.OR);
ReservedWords.set("print", TokenType.PRINT);
ReservedWords.set("return", TokenType.RETURN);
ReservedWords.set("super", TokenType.SUPER);
ReservedWords.set("this", TokenType.THIS);
ReservedWords.set("true", TokenType.TRUE);
ReservedWords.set("var", TokenType.VAR);
ReservedWords.set("sin", TokenType.SIN);
ReservedWords.set("cos", TokenType.COS);
ReservedWords.set("tan", TokenType.TAN);
ReservedWords.set("asin", TokenType.ASIN);
ReservedWords.set("acos", TokenType.ACOS);
ReservedWords.set("atan", TokenType.ATAN);
ReservedWords.set("sqrt", TokenType.SQRT);
ReservedWords.set("while", TokenType.WHILE);

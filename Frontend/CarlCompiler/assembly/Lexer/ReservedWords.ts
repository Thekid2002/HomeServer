import {TokenType} from "./TokenType";

export const ReservedWords: Map<string, TokenType> = new Map<string, TokenType>();


ReservedWords.set("identifier", TokenType.IDENTIFIER);
ReservedWords.set("number_literal", TokenType.NUMBER_LITERAL);
ReservedWords.set("string_literal", TokenType.STRING_LITERAL);

ReservedWords.set("num", TokenType.NUM);
ReservedWords.set("bool", TokenType.BOOL);
ReservedWords.set("string", TokenType.STRING);

ReservedWords.set("and", TokenType.AND);
ReservedWords.set("class", TokenType.CLASS);
ReservedWords.set("fun", TokenType.FUN);
ReservedWords.set("nil", TokenType.NIL);
ReservedWords.set("or", TokenType.OR);
ReservedWords.set("return", TokenType.RETURN);
ReservedWords.set("super", TokenType.SUPER);
ReservedWords.set("this", TokenType.THIS);
ReservedWords.set("var", TokenType.VAR);
ReservedWords.set("true", TokenType.TRUE);
ReservedWords.set("false", TokenType.FALSE);
ReservedWords.set("if", TokenType.IF);
ReservedWords.set("else", TokenType.ELSE);
ReservedWords.set("while", TokenType.WHILE);
ReservedWords.set("for", TokenType.FOR);
ReservedWords.set("sin", TokenType.SIN);
ReservedWords.set("cos", TokenType.COS);
ReservedWords.set("tan", TokenType.TAN);
ReservedWords.set("asin", TokenType.ASIN);
ReservedWords.set("acos", TokenType.ACOS);
ReservedWords.set("atan", TokenType.ATAN);
ReservedWords.set("sqrt", TokenType.SQRT);
ReservedWords.set("scan", TokenType.SCAN);
ReservedWords.set("print", TokenType.PRINT);

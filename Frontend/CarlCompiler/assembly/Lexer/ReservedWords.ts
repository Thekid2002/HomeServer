import {TokenType, TokenTypes} from "./TokenType";

export const ReservedWords: Map<string, TokenType> = new Map<string, TokenType>();

for (let i: i32 = 0; i < TokenTypes.length; i++) {
    ReservedWords.set(TokenTypes[i].toLowerCase(), i);
}
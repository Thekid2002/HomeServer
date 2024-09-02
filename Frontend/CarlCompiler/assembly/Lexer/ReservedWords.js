"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservedWords = void 0;
const TokenType_1 = require("./TokenType");
exports.ReservedWords = new Map();
for (let i = 0; i < TokenType_1.TokenTypes.length; i++) {
    exports.ReservedWords.set(TokenType_1.TokenTypes[i].toLowerCase(), i);
}

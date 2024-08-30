"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementTypeNames = exports.StatementTypeEnum = exports.StatementType = void 0;
const AbstractType_1 = require("./AbstractType");
class StatementType extends AbstractType_1.AbstractType {
    constructor(type, lineNum) {
        super(lineNum);
        this.type = type;
    }
    accept(visitor) {
        return visitor.visitStatementType(this);
    }
    toJsonString() {
        return `{ "type": "${this.type}" }`;
    }
    toString() {
        return exports.StatementTypeNames[this.type];
    }
    clone() {
        return new StatementType(this.type, this.lineNum);
    }
}
exports.StatementType = StatementType;
var StatementTypeEnum;
(function (StatementTypeEnum) {
    StatementTypeEnum[StatementTypeEnum["ERROR"] = 0] = "ERROR";
    StatementTypeEnum[StatementTypeEnum["PROGRAM"] = 1] = "PROGRAM";
    StatementTypeEnum[StatementTypeEnum["ASSIGNMENT"] = 2] = "ASSIGNMENT";
    StatementTypeEnum[StatementTypeEnum["SCAN"] = 3] = "SCAN";
    StatementTypeEnum[StatementTypeEnum["PRINT"] = 4] = "PRINT";
    StatementTypeEnum[StatementTypeEnum["IF"] = 5] = "IF";
    StatementTypeEnum[StatementTypeEnum["WHILE"] = 6] = "WHILE";
    StatementTypeEnum[StatementTypeEnum["FUNCTION_CALL"] = 7] = "FUNCTION_CALL";
    StatementTypeEnum[StatementTypeEnum["RETURN"] = 8] = "RETURN";
    StatementTypeEnum[StatementTypeEnum["BLOCK"] = 9] = "BLOCK";
    StatementTypeEnum[StatementTypeEnum["VAR_DECL"] = 10] = "VAR_DECL";
    StatementTypeEnum[StatementTypeEnum["EXPRESSION"] = 11] = "EXPRESSION";
    StatementTypeEnum[StatementTypeEnum["BREAK"] = 12] = "BREAK";
    StatementTypeEnum[StatementTypeEnum["CONTINUE"] = 13] = "CONTINUE";
    StatementTypeEnum[StatementTypeEnum["FUNCTION_DECLARATION"] = 14] = "FUNCTION_DECLARATION";
    StatementTypeEnum[StatementTypeEnum["VOID"] = 15] = "VOID";
    StatementTypeEnum[StatementTypeEnum["IMPORT"] = 16] = "IMPORT";
})(StatementTypeEnum || (exports.StatementTypeEnum = StatementTypeEnum = {}));
exports.StatementTypeNames = [
    "Error",
    "Ok",
    "PROGRAM",
    "ASSIGNMENT",
    "PRINT",
    "IF",
    "WHILE",
    "FUNCTION",
    "RETURN",
    "BLOCK",
    "VAR_DECL",
    "EXPRESSION",
    "BREAK",
    "CONTINUE",
    "FUNCTION_DECLARATION",
    "VOID",
    "IMPORT"
];

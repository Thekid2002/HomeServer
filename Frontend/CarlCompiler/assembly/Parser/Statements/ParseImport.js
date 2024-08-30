"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseImport = void 0;
const ParseAbstractStatement_1 = require("./ParseAbstractStatement");
class ParseImport extends ParseAbstractStatement_1.ParseAbstractStatement {
    constructor(parentPath, childPath, functionDeclarationWithoutBody, lineNum) {
        super(lineNum);
        this.parentPath = parentPath;
        this.childPath = childPath;
        this.functionDeclarationWithoutBody = functionDeclarationWithoutBody;
    }
    accept(visitor) {
        return visitor.visitImport(this);
    }
    toJsonString() {
        return `{"type": "Import", "parentPath": ${this.parentPath.toJsonString()}, "childPath": ${this.childPath.toJsonString()}}`;
    }
}
exports.ParseImport = ParseImport;

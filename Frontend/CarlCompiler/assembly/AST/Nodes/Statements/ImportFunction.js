"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportFunction = void 0;
const AbstractStatement_1 = require("./AbstractStatement");
const FunctionDeclaration_1 = require("./FunctionDeclaration");
class ImportFunction extends AbstractStatement_1.AbstractStatement {
    constructor(parentPath, childPath, functionDeclarationWithoutBody, lineNum) {
        super(lineNum);
        this.varEnv = null;
        this.parentPath = parentPath;
        this.childPath = childPath;
        this.returnType = functionDeclarationWithoutBody.returnType;
        this.name = functionDeclarationWithoutBody.name;
        this.parameters = functionDeclarationWithoutBody.parameters;
    }
    accept(visitor) {
        return visitor.visitImport(this);
    }
    clone() {
        let returnTypeClone = this.returnType.clone();
        let nameClone = this.name.clone();
        let parametersClone = new Map();
        for (let j = 0; j < this.parameters.keys().length; j++) {
            let key = this.parameters.keys()[j];
            parametersClone.set(key, this.parameters.get(key).clone());
        }
        let parentPath = this.parentPath;
        let childPath = this.childPath;
        return new ImportFunction(parentPath, childPath, new FunctionDeclaration_1.FunctionDeclaration(returnTypeClone, nameClone, parametersClone, null, false, this.lineNum), this.lineNum);
    }
    toString() {
        return "ImportFunction";
    }
}
exports.ImportFunction = ImportFunction;

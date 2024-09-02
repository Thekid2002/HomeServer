"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionDeclaration = void 0;
const AbstractStatement_1 = require("./AbstractStatement");
class FunctionDeclaration extends AbstractStatement_1.AbstractStatement {
    constructor(returnType, name, parameters, body, $export, lineNum) {
        super(lineNum);
        this.varEnv = null;
        this.returnType = returnType;
        this.name = name;
        this.parameters = parameters;
        this.body = body;
        this.export = $export;
    }
    accept(visitor) {
        return visitor.visitFunctionDeclaration(this);
    }
    clone() {
        let returnTypeClone = this.returnType.clone();
        let nameClone = this.name.clone();
        let parametersClone = new Map();
        for (let j = 0; j < this.parameters.keys().length; j++) {
            let key = this.parameters.keys()[j];
            parametersClone.set(key, this.parameters.get(key).clone());
        }
        let bodyClone = this.body != null ? this.body.clone() : null;
        let $export = this.export;
        return new FunctionDeclaration(returnTypeClone, nameClone, parametersClone, bodyClone, $export, this.lineNum);
    }
    toString() {
        throw new Error("Method not implemented.");
    }
}
exports.FunctionDeclaration = FunctionDeclaration;

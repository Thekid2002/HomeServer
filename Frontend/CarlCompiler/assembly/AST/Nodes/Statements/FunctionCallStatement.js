"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionCallStatement = void 0;
const AbstractStatement_1 = require("./AbstractStatement");
class FunctionCallStatement extends AbstractStatement_1.AbstractStatement {
    constructor(functionName, actualParameters, lineNum) {
        super(lineNum);
        this.expectedParameters = null;
        this.functionName = functionName;
        this.actualParameters = actualParameters;
    }
    accept(visitor) {
        return visitor.visitFunctionCallStatement(this);
    }
    clone() {
        let functionNameClone = this.functionName;
        let actualParametersClone = [];
        for (let i = 0; i < this.actualParameters.length; i++) {
            actualParametersClone.push(this.actualParameters[i].clone());
        }
        return new FunctionCallStatement(functionNameClone, actualParametersClone, this.lineNum);
    }
    toString() {
        let string = this.functionName + "(";
        for (let i = 0; i < this.actualParameters.length; i++) {
            string += this.actualParameters[i].toString();
            if (i < this.actualParameters.length - 1) {
                string += ", ";
            }
        }
        string += ")";
        return string;
    }
}
exports.FunctionCallStatement = FunctionCallStatement;

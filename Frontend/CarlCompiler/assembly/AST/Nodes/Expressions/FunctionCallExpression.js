"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionCallExpression = void 0;
const AbstractExpression_1 = require("./AbstractExpression");
class FunctionCallExpression extends AbstractExpression_1.AbstractExpression {
    constructor(functionName, actualParameters, lineNum) {
        super(lineNum);
        this.expectedParameters = null;
        this.functionName = functionName;
        this.actualParameters = actualParameters;
    }
    accept(visitor) {
        return visitor.visitFunctionCallExpression(this);
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
    clone() {
        let functionNameClone = this.functionName;
        let actualParametersClone = [];
        for (let i = 0; i < this.actualParameters.length; i++) {
            actualParametersClone.push(this.actualParameters[i].clone());
        }
        return new FunctionCallExpression(functionNameClone, actualParametersClone, this.lineNum);
    }
}
exports.FunctionCallExpression = FunctionCallExpression;

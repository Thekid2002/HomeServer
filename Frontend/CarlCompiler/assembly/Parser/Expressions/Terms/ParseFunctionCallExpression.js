"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseFunctionCallExpression = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class ParseFunctionCallExpression extends AbstractTerm_1.AbstractTerm {
    constructor(functionName, actualParameters, lineNum) {
        super(lineNum);
        this.functionName = functionName;
        this.actualParameters = actualParameters;
    }
    accept(visitor) {
        return visitor.visitFunctionCallExpression(this);
    }
    toJsonString() {
        let string = "{\n";
        string += "\"type\": \"FunctionCall\",\n";
        string += "\"functionName\": \"" + this.functionName + "\",\n";
        string += "\"actualParameters\": [";
        for (let i = 0; i < this.actualParameters.length; i++) {
            string += this.actualParameters[i].toJsonString();
            if (i < this.actualParameters.length - 1) {
                string += ", ";
            }
        }
        string += "],\n";
        string += "\"line\": " + this.lineNum + "\n";
        string += "}";
        return string;
    }
}
exports.ParseFunctionCallExpression = ParseFunctionCallExpression;

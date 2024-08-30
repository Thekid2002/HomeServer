"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseFunctionCallStatement = void 0;
const ParseAbstractStatement_1 = require("./ParseAbstractStatement");
class ParseFunctionCallStatement extends ParseAbstractStatement_1.ParseAbstractStatement {
    constructor(functionName, actualParameters, lineNum) {
        super(lineNum);
        this.functionName = functionName;
        this.actualParameters = actualParameters;
    }
    accept(visitor) {
        return visitor.visitFunctionCallStatement(this);
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
exports.ParseFunctionCallStatement = ParseFunctionCallStatement;

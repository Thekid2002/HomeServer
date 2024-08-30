"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseFunctionDeclaration = void 0;
const ParseAbstractStatement_1 = require("./ParseAbstractStatement");
class ParseFunctionDeclaration extends ParseAbstractStatement_1.ParseAbstractStatement {
    constructor(returnType, name, parameters, body, $export, lineNum) {
        super(lineNum);
        this.returnType = returnType;
        this.name = name;
        this.parameters = parameters;
        this.body = body;
        this.export = $export;
    }
    accept(visitor) {
        return visitor.visitFunction(this);
    }
    toJsonString() {
        let string = `{"type": "Function", "returnType": ${this.returnType.toJsonString()}, "name": ${this.name.toJsonString()}, "parameters": [`;
        let i = 0;
        for (let j = 0; j < this.parameters.keys().length; j++) {
            let key = this.parameters.keys()[j];
            string += `{"${key}": ${this.parameters.get(key).toJsonString()}, "type": ${this.parameters.get(key).toJsonString()}}`;
            if (i < this.parameters.keys().length - 1) {
                string += ", ";
            }
            i++;
        }
        string += "], \"body\": [";
        string += this.body != null ? this.body.toJsonString() : "";
        string += "]" + "\"export\": " + this.export + "}";
        return string;
    }
}
exports.ParseFunctionDeclaration = ParseFunctionDeclaration;

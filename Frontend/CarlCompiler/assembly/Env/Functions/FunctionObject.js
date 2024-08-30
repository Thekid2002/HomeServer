"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionObject = void 0;
class FunctionObject {
    constructor(name, returnType, parameters, varEnv) {
        this.name = name;
        this.returnType = returnType;
        this.parameters = parameters;
        this.varEnv = varEnv;
    }
    toJsonString() {
        let string = "{\n";
        string += "\"name\": \"" + this.name + "\",\n";
        string += "\"returnType\": " + this.returnType.toJsonString() + ",\n";
        string += "\"params\": {";
        for (let i = 0; i < this.parameters.size; i++) {
            string +=
                "\"" +
                    this.parameters.keys()[i] +
                    "\": " +
                    this.parameters.get(this.parameters.keys()[i]).toJsonString();
            if (i < this.parameters.size - 1) {
                string += ", ";
            }
        }
        string += "},\n";
        string += "\"varEnv\": " + this.varEnv.toJsonString();
        string += "}\n";
        return string;
    }
}
exports.FunctionObject = FunctionObject;

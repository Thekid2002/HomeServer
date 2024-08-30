"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncEnv = void 0;
const FunctionObject_1 = require("./Functions/FunctionObject");
class FuncEnv {
    constructor(parent) {
        this.funcs = new Map();
        this.parent = parent;
    }
    enterScope() {
        return new FuncEnv(this);
    }
    exitScope() {
        return this.parent == null ? this : this.parent;
    }
    addFunc(name, returnType, parameters, varEnv) {
        let func = new FunctionObject_1.FunctionObject(name, returnType, parameters, varEnv);
        this.funcs.set(name, func);
    }
    lookUp(name) {
        if (this.funcs.has(name)) {
            return this.funcs.get(name);
        }
        return this.parent !== null ? this.parent.lookUp(name) : null;
    }
    toJsonString() {
        let string = "{\n";
        for (let i = 0; i < this.funcs.size; i++) {
            string +=
                "\"" +
                    this.funcs.keys()[i].toString() +
                    "\": " +
                    (this.funcs.get(this.funcs.keys()[i]) !== null
                        ? this.funcs.get(this.funcs.keys()[i]).toJsonString()
                        : "null");
            if (i < this.funcs.size - 1) {
                string += ", ";
            }
        }
        string += "}\n";
        return string;
    }
}
exports.FuncEnv = FuncEnv;

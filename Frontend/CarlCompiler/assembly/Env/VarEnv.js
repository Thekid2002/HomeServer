"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarEnv = void 0;
class VarEnv {
    constructor(parent) {
        this.parent = null;
        this.children = [];
        this.vars = new Map();
        this.parent = parent;
    }
    enterScope() {
        let newEnv = new VarEnv(this);
        this.children.push(newEnv);
        return newEnv;
    }
    exitScope() {
        return this.parent == null ? this : this.parent;
    }
    addVar(name, type) {
        this.vars.set(name, new ValueType(type));
    }
    addGlobalVar(name, type) {
        VarEnv.globalVars.set(name, new ValueType(type));
    }
    lookUpType(name) {
        if (this.vars.has(name)) {
            return this.vars.get(name).type;
        }
        if (this.parent !== null) {
            return this.parent.lookUpType(name);
        }
        return this.lookUpGlobalType(name);
    }
    lookUpGlobalType(name) {
        if (VarEnv.globalVars.has(name)) {
            return VarEnv.globalVars.get(name).type;
        }
        return null;
    }
    lookUpValue(name) {
        if (this.vars.has(name)) {
            return this.vars.get(name).value;
        }
        return this.parent !== null ? this.parent.lookUpValue(name) : null;
    }
    setVarVal(name, value) {
        if (this.vars.has(name)) {
            this.vars.get(name).value = value;
        }
    }
    getDeclarations(reduceParameters) {
        let string = "";
        for (let i = 0; i < this.vars.size; i++) {
            let key = this.vars.keys()[i];
            if (reduceParameters !== null && reduceParameters.includes(key)) {
                continue;
            }
            let type = this.vars.values()[i];
            if (type.toString() === "string") {
                string += `(local $${this.vars.keys()[i]} i32)\n`;
            }
            else {
                string += `(local $${this.vars.keys()[i]} ${this.vars.values()[i].toString()})\n`;
            }
        }
        return string;
    }
    toJsonString() {
        let string = "{\n";
        const keysArray = this.vars.keys();
        for (let i = 0; i < keysArray.length; i++) {
            const key = keysArray[i].toString();
            const value = this.vars.get(keysArray[i]);
            string +=
                "\"" + key + "\": " + (value !== null ? value.toJsonString() : "null");
            if (i < keysArray.length - 1) {
                // Correct condition to avoid trailing comma
                string += ", ";
            }
        }
        if (this.children.length > 0) {
            if (keysArray.length > 0) {
                string += ", "; // Add comma only if there are both vars and children
            }
            string += "\"children\": [";
            for (let i = 0; i < this.children.length; i++) {
                string += this.children[i].toJsonString();
                if (i < this.children.length - 1) {
                    string += ", ";
                }
            }
            string += "]";
        }
        string += "\n}";
        return string;
    }
    static resetGlobalVars() {
        VarEnv.globalVars = new Map();
    }
}
exports.VarEnv = VarEnv;
VarEnv.globalVars = new Map();
class ValueType {
    constructor(type) {
        this.value = null;
        this.type = type;
    }
    toString() {
        return this.type.toString();
    }
    toJsonString() {
        return this.type.toJsonString();
    }
}

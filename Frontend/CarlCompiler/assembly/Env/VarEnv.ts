import { AbstractType } from "../AST/Nodes/Types/AbstractType";
import { ValObject } from "./Values/ValObject";

export class VarEnv {
    public static globalVars: Map<string, ValueType> = new Map<
    string,
    ValueType
  >();
    public vars: Map<string, ValueType>;
    public parent: VarEnv | null = null;
    public children: Array<VarEnv> = new Array<VarEnv>();

    constructor(parent: VarEnv | null) {
        this.vars = new Map<string, ValueType>();
        this.parent = parent;
    }

    public enterScope(): VarEnv {
        const newEnv = new VarEnv(this);
        this.children.push(newEnv);
        return newEnv;
    }

    public exitScope(): VarEnv {
        return this.parent == null ? this : this.parent;
    }

    public addVar(name: string, type: AbstractType): void {
        this.vars.set(name, new ValueType(type));
    }

    public addGlobalVar(name: string, type: AbstractType): void {
        VarEnv.globalVars.set(name, new ValueType(type));
    }

    public lookUpType(name: string): AbstractType | null {
        if (this.vars.has(name)) {
            return this.vars.get(name).type;
        }
        if (this.parent !== null) {
            return this.parent!.lookUpType(name);
        }

        return this.lookUpGlobalType(name);
    }

    public lookUpGlobalType(name: string): AbstractType | null {
        if (VarEnv.globalVars.has(name)) {
            return VarEnv.globalVars.get(name).type;
        }
        return null;
    }

    public lookUpValue(name: string): ValObject | null {
        if (this.vars.has(name)) {
            return this.vars.get(name).value;
        }
        return this.parent !== null ? this.parent!.lookUpValue(name) : null;
    }

    public setVarVal(name: string, value: ValObject): void {
        if (this.vars.has(name)) {
            this.vars.get(name).value = value;
        }
    }

    getDeclarations(reduceParameters: Array<string> | null): string {
        let string = "";
        for (let i = 0; i < this.vars.size; i++) {
            const key = this.vars.keys()[i];
            if (reduceParameters !== null && reduceParameters.includes(key)) {
                continue;
            }
            const type = this.vars.values()[i];
            if (type.toString() === "string") {
                string += `(local $${this.vars.keys()[i]} i32)\n`;
            } else {
                string += `(local $${this.vars.keys()[i]} ${this.vars.values()[i].toString()})\n`;
            }
        }
        return string;
    }

    toJsonString(): string {
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

    static resetGlobalVars(): void {
        VarEnv.globalVars = new Map<string, ValueType>();
    }
}

class ValueType {
    type: AbstractType;
    value: ValObject | null = null;

    constructor(type: AbstractType) {
        this.type = type;
    }

    toString(): string {
        return this.type.toString();
    }

    toJsonString(): string {
        return this.type.toJsonString();
    }
}

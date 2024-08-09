import {AbstractType} from "../AST/Nodes/Types/AbstractType";
import {ValObject} from "./Values/ValObject";

export class VarEnv {
    public vars: Map<string, ValueType>;
    public parent: VarEnv | null = null;

    constructor(parent: VarEnv | null) {
        this.vars = new Map<string, ValueType>();
    }

    public enterScope(): VarEnv {
        return new VarEnv(this);
    }

    public exitScope(): VarEnv {
        return this.parent == null ? this : this.parent;
    }

    public addVar(name: string, type: AbstractType): void {
        this.vars.set(name, new ValueType(type));
    }

    public lookUpType(name: string): AbstractType | null {
        if (this.vars.has(name)) {
            return this.vars.get(name).type;
        }
        return this.parent !== null ? this.parent!.lookUpType(name) : null;
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
            let key = this.vars.keys()[i];
            if(reduceParameters !== null && reduceParameters.includes(key)) {
                continue;
            }
            let type = this.vars.values()[i];
            if(type.toString() === "string") {
                string += `(local $${this.vars.keys()[i]} i32)\n`;
            }else {
                string += `(local $${this.vars.keys()[i]} ${this.vars.values()[i].toString()})\n`;
            }
        }
        return string;
    }

    toJsonString(): string {
        let string = "{\n";
        for (let i = 0; i < this.vars.size; i++) {
            string += "\"" + this.vars.keys()[i].toString() + "\": " + (this.vars.get(this.vars.keys()[i]) !== null ? this.vars.get(this.vars.keys()[i]).toJsonString() : "null");
            if (i < this.vars.size - 1) {
                string += ", ";
            }
        }
        string += "}\n";
        return string;
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

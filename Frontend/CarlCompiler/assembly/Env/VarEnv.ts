import {AbstractType} from "../AST/Nodes/Types/AbstractType";

export class VarEnv {
    public vars: Map<string, AbstractType>;

    constructor() {
        this.vars = new Map<string, AbstractType>();
    }

    public addVar(name: string, value: AbstractType): void {
        this.vars.set(name, value);
    }

    public lookUp(name: string): AbstractType | null {
        if (this.vars.has(name)) {
            return this.vars.get(name);
        }
        return null;
    }

    public setVar(name: string, value: AbstractType): void {
        this.vars.set(name, value);
    }

    getDeclarations(): string {
        let string = "";
        for (let i = 0; i < this.vars.size; i++) {
            string += `(local $${this.vars.keys()[i]} ${this.vars.values()[i].toString()})\n`;
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

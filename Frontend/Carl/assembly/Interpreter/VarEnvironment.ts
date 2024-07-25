import {ValObject} from "./Values/ValObject";

export class VarEnvironment {
    public vars: Map<string, ValObject | null>;

    constructor() {
        this.vars = new Map<string, ValObject | null>();
    }

    public addVar(name: string, value: ValObject | null): void {
        this.vars.set(name, value);
    }

    public lookUp(name: string): ValObject | null {
        if (this.vars.has(name)) {
            return this.vars.get(name);
        }
        return null;
    }

    public setVar(name: string, value: ValObject | null): void {
        this.vars.set(name, value);
    }

    toJsonString(): string {
        let string = "{\n";
        string += "\"vars\": {\n";
        for (let i = 0; i < this.vars.size; i++) {
            string += "\"" + this.vars.keys()[i].toString() + "\": " + (this.vars.get(this.vars.keys()[i]) !== null ? this.vars.get(this.vars.keys()[i])!.toJsonString() : "null");
            if (i < this.vars.size - 1) {
                string += ", ";
            }
        }
        string += "}\n";
        string += "}\n";
        return string;
    }
}

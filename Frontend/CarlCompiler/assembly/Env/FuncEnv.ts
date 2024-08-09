import {AbstractType} from "../AST/Nodes/Types/AbstractType";
import {FunctionObject} from "./Functions/FunctionObject";
import {VarEnv} from "./VarEnv";

export class FuncEnv {
    public funcs: Map<string, FunctionObject>;
    public parent: FuncEnv | null;

    constructor(parent: FuncEnv | null) {
        this.funcs = new Map<string, FunctionObject>();
        this.parent = parent;
    }

    public enterScope(): FuncEnv {
        return new FuncEnv(this);
    }

    public exitScope(): FuncEnv {
        return this.parent == null ? this : this.parent;
    }

    public addFunc(name: string, returnType: AbstractType, parameters: Map<string, AbstractType>, varEnv: VarEnv): void {
        let func = new FunctionObject(name, returnType, parameters, varEnv);
        this.funcs.set(name, func);
    }

    public lookUp(name: string): FunctionObject | null {
        if (this.funcs.has(name)) {
            return this.funcs.get(name);
        }
        return this.parent !== null ? this.parent!.lookUp(name) : null;
    }

    public toJsonString(): string {
        let string = "{\n";
        for (let i = 0; i < this.funcs.size; i++) {
            string += "\"" + this.funcs.keys()[i].toString() + "\": " + (this.funcs.get(this.funcs.keys()[i]) !== null ? this.funcs.get(this.funcs.keys()[i]).toJsonString() : "null");
            if (i < this.funcs.size - 1) {
                string += ", ";
            }
        }
        string += "}\n";
        return string;
    }
}

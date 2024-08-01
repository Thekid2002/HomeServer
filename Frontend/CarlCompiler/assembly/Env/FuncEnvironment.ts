import {FuncObject} from "../Env/Functions/FuncObject";

export class FuncEnvironment {
    public funcs: Map<string, FuncObject>;

    constructor() {
        this.funcs = new Map<string, FuncObject>();
    }

    public addFunc(name: string, func: FuncObject): void {
        this.funcs.set(name, func);
    }

    public lookUp(name: string): FuncObject | null {
        if (this.funcs.has(name)) {
            return this.funcs.get(name);
        }
        return null;
    }

}

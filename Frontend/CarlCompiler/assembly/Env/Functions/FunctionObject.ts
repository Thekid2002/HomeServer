import { AbstractType } from "../../AST/Nodes/Types/AbstractType";
import { VarEnv } from "../VarEnv";

export class FunctionObject {
    public name: string;
    public returnType: AbstractType;
    public parameters: Map<string, AbstractType>;
    public varEnv: VarEnv;

    constructor(
        name: string,
        returnType: AbstractType,
        parameters: Map<string, AbstractType>,
        varEnv: VarEnv
    ) {
        this.name = name;
        this.returnType = returnType;
        this.parameters = parameters;
        this.varEnv = varEnv;
    }

    public toJsonString(): string {
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

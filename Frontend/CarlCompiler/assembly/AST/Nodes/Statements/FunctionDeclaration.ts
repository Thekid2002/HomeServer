import { AbstractStatement } from "./AbstractStatement";
import { Identifier } from "../Expressions/Terms/Identifier";
import { AbstractType } from "../Types/AbstractType";
import { ASTVisitor } from "../../ASTVisitor";
import { AbstractNode } from "../AbstractNode";
import { VarEnv } from "../../../Env/VarEnv";

export class FunctionDeclaration extends AbstractStatement {
    public returnType: AbstractType;
    public name: Identifier;
    public parameters: Map<string, AbstractType>;
    public body: AbstractStatement | null;
    public export: boolean;
    public varEnv: VarEnv | null = null;

    constructor(
        returnType: AbstractType,
        name: Identifier,
        parameters: Map<string, AbstractType>,
        body: AbstractStatement | null,
        $export: boolean,
        lineNum: i32
    ) {
        super(lineNum);
        this.returnType = returnType;
        this.name = name;
        this.parameters = parameters;
        this.body = body;
        this.export = $export;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitFunctionDeclaration(this);
    }

    clone(): AbstractNode {
        const returnTypeClone = this.returnType.clone() as AbstractType;
        const nameClone = this.name.clone() as Identifier;
        const parametersClone = new Map<string, AbstractType>();
        for (let j = 0; j < this.parameters.keys().length; j++) {
            const key = this.parameters.keys()[j];
            parametersClone.set(
                key,
        this.parameters.get(key).clone() as AbstractType
            );
        }
        const bodyClone =
      this.body != null ? (this.body!.clone() as AbstractStatement) : null;
        const $export = this.export;
        return new FunctionDeclaration(
            returnTypeClone,
            nameClone,
            parametersClone,
            bodyClone,
            $export,
            this.lineNum
        );
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }
}

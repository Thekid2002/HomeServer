import { AbstractStatement } from "./AbstractStatement";
import { FunctionDeclaration } from "./FunctionDeclaration";
import { ASTVisitor } from "../../ASTVisitor";
import { AbstractNode } from "../AbstractNode";
import { AbstractType } from "../Types/AbstractType";
import { Identifier } from "../Expressions/Terms/Identifier";
import { VarEnv } from "../../../Env/VarEnv";

export class ImportFunction extends AbstractStatement {
    public parentPath: string;
    public childPath: string;

    public returnType: AbstractType;
    public name: Identifier;
    public parameters: Map<string, AbstractType>;
    public varEnv: VarEnv | null = null;

    constructor(
        parentPath: string,
        childPath: string,
        functionDeclarationWithoutBody: FunctionDeclaration,
        lineNum: i32
    ) {
        super(lineNum);
        this.parentPath = parentPath;
        this.childPath = childPath;
        this.returnType = functionDeclarationWithoutBody.returnType;
        this.name = functionDeclarationWithoutBody.name;
        this.parameters = functionDeclarationWithoutBody.parameters;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitImport(this);
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
        const parentPath = this.parentPath;
        const childPath = this.childPath;
        return new ImportFunction(
            parentPath,
            childPath,
            new FunctionDeclaration(
                returnTypeClone,
                nameClone,
                parametersClone,
                null,
                false,
                this.lineNum
            ),
            this.lineNum
        );
    }

    toString(): string {
        return "ImportFunction";
    }
}

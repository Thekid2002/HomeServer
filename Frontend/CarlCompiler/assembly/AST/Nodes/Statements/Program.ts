import { AbstractStatement } from "./AbstractStatement";
import { ASTVisitor } from "../../ASTVisitor";
import { VarEnv } from "../../../Env/VarEnv";
import { FuncEnv } from "../../../Env/FuncEnv";

export class Program extends AbstractStatement {
    body: AbstractStatement | null;
    varEnv: VarEnv | null = null;

    constructor(body: AbstractStatement | null, lineNum: i32) {
        super(lineNum);
        this.body = body;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitProgram(this);
    }

    clone(): Program {
        return new Program(
            this.body !== null ? (this.body!.clone() as AbstractStatement) : null,
            this.lineNum
        );
    }

    toString(): string {
        return (
            "Program(" + (this.body !== null ? this.body!.toString() : "null") + ")"
        );
    }
}

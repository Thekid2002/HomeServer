import {AbstractStatement} from "./AbstractStatement";
import {ASTVisitor} from "../../ASTVisitor";

export class Program extends AbstractStatement {
    body: AbstractStatement | null;

    constructor(body: AbstractStatement | null, lineNum: i32) {
        super(lineNum);
        this.body = body;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitProgram(this);
    }

    clone(): Program {
        return new Program(
            this.body !== null ? this.body!.clone() as AbstractStatement : null,
            this.lineNum
        );
    }

    toString(): string {
        return "Program(" + (this.body !== null ? this.body!.toString() : "null") + ")";
    }
}

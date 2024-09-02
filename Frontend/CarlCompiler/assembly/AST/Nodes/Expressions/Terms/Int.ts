import { AbstractTerm } from "./AbstractTerm";
import { ASTVisitor } from "../../../ASTVisitor";

export class Int extends AbstractTerm {
    constructor(value: string, lineNum: i32) {
        super(lineNum, value);
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitInt(this);
    }

    clone(): Int {
        return new Int(this.value, this.lineNum);
    }

    toString(): string {
        return "Int(" + this.value + ")";
    }
}

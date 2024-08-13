import {AbstractTerm} from "./AbstractTerm";
import {ASTVisitor} from "../../../ASTVisitor";

export class Double extends AbstractTerm {
    constructor(value: string, lineNum: i32) {
        super(lineNum, value);
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitDouble(this);
    }

    clone(): Double {
        return new Double(
            this.value,
            this.lineNum
        );
    }

    toString(): string {
        return "Double(" + this.value + ")";
    }
}
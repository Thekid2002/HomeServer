import {AbstractTerm} from "./AbstractTerm";
import {ASTVisitor} from "../../../ASTVisitor";

export class Term extends AbstractTerm {
    constructor(value: string, lineNum: i32) {
        super(lineNum, value);
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitTerm(this);
    }

    clone(): Term {
        return new Term(
            this.value,
            this.lineNum
        );
    }

    toString(): string {
        return "Term(" + this.value + ")";
    }
}

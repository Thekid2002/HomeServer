import {AbstractTerm} from "./AbstractTerm";
import {ASTVisitor} from "../../../ASTVisitor";

export class Bool extends AbstractTerm {
    constructor(value: string, lineNum: i32) {
        super(lineNum, value);
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitBool(this);
    }

    clone(): Bool {
        return new Bool(
            this.value,
            this.lineNum
        );
    }

    toString(): string {
        return "Bool(" + this.value + ")";
    }
}
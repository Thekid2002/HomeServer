import {AbstractTerm} from "./AbstractTerm";
import {ASTVisitor} from "../../../ASTVisitor";

export class Num extends AbstractTerm {

    constructor(value: string, lineNum: i32) {
        super(lineNum, value);
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitNumber(this);
    }
}

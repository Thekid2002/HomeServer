import {AbstractTerm} from "./AbstractTerm";
import {ASTVisitor} from "../../../ASTVisitor";

export class Identifier extends AbstractTerm {

    constructor(name: string, lineNum: i32) {
        super(lineNum, name);
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitIdentifier(this);
    }
}

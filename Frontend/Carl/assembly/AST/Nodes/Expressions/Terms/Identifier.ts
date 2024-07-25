import {AbstractTerm} from "./AbstractTerm";
import {ASTVisitor} from "../../../ASTVisitor";

export class Identifier extends AbstractTerm {
    name: string;

    constructor(name: string, lineNum: i32) {
        super(lineNum);
        this.name = name
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitIdentifier(this);
    }
}

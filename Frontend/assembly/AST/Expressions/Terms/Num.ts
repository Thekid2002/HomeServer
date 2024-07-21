import {AbstractTerm} from "./AbstractTerm";
import {ASTVisitor} from "../../ASTVisitor";

export class Num extends AbstractTerm {
    value: string;
    constructor(value: string) {
        super();
        this.value = value;
    }
    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitNumber(this);
    }
}

import {AbstractTerm} from "./AbstractTerm";
import {ASTVisitor} from "../../../ASTVisitor";

export class Identifier extends AbstractTerm {

    constructor(name: string, lineNum: i32) {
        super(lineNum, name);
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitIdentifier(this);
    }

    clone(): Identifier {
        return new Identifier(
            this.value,
            this.lineNum
        );
    }

    toString(): string {
        return "Identifier(" + this.value + ")";
    }
}

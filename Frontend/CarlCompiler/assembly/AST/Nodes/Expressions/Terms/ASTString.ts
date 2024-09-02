import { AbstractTerm } from "./AbstractTerm";
import { ASTVisitor } from "../../../ASTVisitor";

export class ASTString extends AbstractTerm {
    memoryLocation: i32 = 0;

    constructor(value: string, lineNum: i32) {
        super(lineNum, value);
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitString(this);
    }

    toJsonString(): string {
        return `{"type": "String", "value": "${this.value}"}`;
    }

    clone(): ASTString {
        return new ASTString(this.value, this.lineNum);
    }

    toString(): string {
        return "ASTString(" + this.value + ")";
    }
}

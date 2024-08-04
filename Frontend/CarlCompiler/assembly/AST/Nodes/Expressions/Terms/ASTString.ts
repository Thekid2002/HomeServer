import {AbstractTerm} from "./AbstractTerm";
import {ASTVisitor} from "../../../ASTVisitor";

export class ASTString extends AbstractTerm {
    memoryLocation: i32 = 0;
    length: i32 = 0;

    constructor(value: string, lineNum: i32) {
        super(lineNum, value);
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitString(this);
    }

    toJsonString(): string {
        return `{"type": "String", "value": "${this.value}"}`;
    }
}

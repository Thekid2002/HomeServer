import {AbstractTerm} from "./AbstractTerm";
import {ASTVisitor} from "../../../ASTVisitor";

export class ASTString extends AbstractTerm {
    value: string;

    constructor(value: string, lineNum: i32) {
        super(lineNum);
        this.value = value;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitString(this);
    }

    toJsonString(): string {
        return `{"type": "String", "value": "${this.value}"}`;
    }
}

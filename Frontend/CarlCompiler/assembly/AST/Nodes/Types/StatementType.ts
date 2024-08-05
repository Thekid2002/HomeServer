import { ASTVisitor } from "../../ASTVisitor";
import {AbstractType} from "./AbstractType";
import {AbstractNode} from "../AbstractNode";

export class StatementType extends AbstractType {
    type: StatementTypeEnum;

    constructor(type: StatementTypeEnum, lineNum: i32) {
        super(lineNum);
        this.type = type;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitStatementType(this);
    }

    toJsonString(): string {
        return `{ "type": "${this.type}" }`;
    }

    toString(): string {
        return StatementTypeNames[this.type];
    }

    clone(): AbstractNode {
        return new StatementType(this.type, this.lineNum);
    }

}

export enum StatementTypeEnum {
    Error,
    Ok,
    PROGRAM,
    ASSIGNMENT,
    PRINT,
    IF,
    WHILE,
    FUNCTION,
    RETURN,
    BLOCK,
    VAR_DECL,
    EXPRESSION,
    BREAK,
    CONTINUE,
}

export const StatementTypeNames: Array<string> = [
    "Error",
    "Ok",
    "PROGRAM",
    "ASSIGNMENT",
    "PRINT",
    "IF",
    "WHILE",
    "FUNCTION",
    "RETURN",
    "BLOCK",
    "VAR_DECL",
    "EXPRESSION",
    "BREAK",
    "CONTINUE",
];


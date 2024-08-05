import {ASTVisitor} from "../../ASTVisitor";
import {AbstractType} from "./AbstractType";
import {AbstractNode} from "../AbstractNode";

export class ValueType extends AbstractType {
    type: ValueTypeEnum;

    constructor(type: ValueTypeEnum, lineNum: i32) {
        super(lineNum);
        this.type = type;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitValueType(this);
    }

    toString(): string {
        switch (this.type) {
            case ValueTypeEnum.Error:
                return "Error";
            case ValueTypeEnum.NUM:
                return "f64";
            case ValueTypeEnum.BOOL:
                return "i32";
            case ValueTypeEnum.STRING:
                return "string";
            default:
                return "Unknown";
        }
    }

    toJsonString(): string {
        return `{ "type": "${this.type}" }`;
    }

    clone(): AbstractNode {
        return new ValueType(this.type, this.lineNum);
    }
}

export enum ValueTypeEnum {
    Error,
    NUM,
    BOOL,
    STRING,
}

export const ValueTypeNames: Array<string> = [
    "Error",
    "NUM",
    "BOOL",
    "STRING",
];

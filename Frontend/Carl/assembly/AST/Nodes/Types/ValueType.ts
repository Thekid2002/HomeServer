import { ASTVisitor } from "../../ASTVisitor";
import {AbstractType} from "./AbstractType";

export class ValueType extends AbstractType {
    type: ValueTypeEnum;

    constructor(type: ValueTypeEnum, lineNum: i32) {
        super(lineNum);
        this.type = type;
    }
    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitValueType(this);
    }
}

export enum ValueTypeEnum {
    Error,
    NUM,
    BOOL,
    STRING,
}

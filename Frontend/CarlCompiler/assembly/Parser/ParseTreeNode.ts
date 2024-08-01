import {ParseVisitor} from "./ParseVisitor";

export abstract class ParseTreeNode {
    lineNum: i32;

    abstract accept<T>(visitor: ParseVisitor<T>): T;

    constructor(lineNum: i32) {
        this.lineNum = lineNum;
    }

    abstract toJsonString(): string;
}

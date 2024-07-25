import {ASTVisitor} from "../ASTVisitor";

export abstract class AbstractNode {
    lineNum: i32;

    abstract accept<T>(visitor: ASTVisitor<T>): T;

    constructor(lineNum: i32) {
        this.lineNum = lineNum;
    }
}

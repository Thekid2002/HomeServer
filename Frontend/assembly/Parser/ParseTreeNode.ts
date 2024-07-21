import {ParseVisitor} from "./ParseVisitor";

export abstract class ParseTreeNode {
    abstract accept<T>(visitor: ParseVisitor<T>): T;

}

import {ASTVisitor} from "./ASTVisitor";

export abstract class AbstractSyntaxNode {
    abstract accept<T>(visitor: ASTVisitor<T>): T;
}

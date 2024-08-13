import {ParseString} from "../Expressions/Terms/ParseString";
import {ParseAbstractStatement} from "./ParseAbstractStatement";
import {ParseVisitor} from "../ParseVisitor";
import {ParseFunctionDeclaration} from "./ParseFunctionDeclaration";

export class ParseImport extends ParseAbstractStatement {
    public parentPath: ParseString;
    public childPath: ParseString;
    public functionDeclarationWithoutBody: ParseFunctionDeclaration;

    constructor(parentPath: ParseString, childPath: ParseString, functionDeclarationWithoutBody: ParseFunctionDeclaration, lineNum: i32) {
        super(lineNum);
        this.parentPath = parentPath;
        this.childPath = childPath;
        this.functionDeclarationWithoutBody = functionDeclarationWithoutBody;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitImport(this);
    }

    toJsonString(): string {
        return `{"type": "Import", "parentPath": ${this.parentPath.toJsonString()}, "childPath": ${this.childPath.toJsonString()}}`;
    }
}
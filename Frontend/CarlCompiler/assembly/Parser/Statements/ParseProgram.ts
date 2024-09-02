import { ParseVisitor } from "../ParseVisitor";
import { ParseAbstractStatement } from "./ParseAbstractStatement";

export class ParseProgram extends ParseAbstractStatement {
    body: ParseAbstractStatement | null;

    constructor(body: ParseAbstractStatement | null, lineNum: i32) {
        super(lineNum);
        this.body = body;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitProgram(this);
    }

    toJsonString(): string {
        return `{"type": "Program", "body": ${this.body !== null ? this.body!.toJsonString() : "null"}}`;
    }
}

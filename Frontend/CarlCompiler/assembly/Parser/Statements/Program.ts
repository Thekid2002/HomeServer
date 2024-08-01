import {ParseVisitor} from "../ParseVisitor";
import {AbstractStatement} from "./AbstractStatement";

export class Program extends AbstractStatement {
    body: Array<AbstractStatement>;

    constructor(body: Array<AbstractStatement>, lineNum: i32) {
        super(lineNum);
        this.body = body;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitProgram(this);
    }

    toJsonString(): string {
        return `{"type": "Program", "statements": [${this.body.map(statement => statement.toJsonString()).join(", ")}]}`;
    }
}

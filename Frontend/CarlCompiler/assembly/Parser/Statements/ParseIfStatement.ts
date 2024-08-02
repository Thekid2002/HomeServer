import { ParseVisitor } from "../ParseVisitor";
import {ParseAbstractStatement} from "./ParseAbstractStatement";
import {ParseAbstractExpression} from "../Expressions/ParseAbstractExpression";

export class ParseIfStatement extends ParseAbstractStatement {
    condition: ParseAbstractExpression;
    body: ParseAbstractStatement | null;
    else: ParseAbstractStatement | null;

    constructor(condition: ParseAbstractExpression, body: ParseAbstractStatement | null, $else: ParseAbstractStatement | null, lineNum: i32) {
        super(lineNum);
        this.condition = condition;
        this.body = body;
        this.else = $else;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitIfStatement(this);
    }

    toJsonString(): string {
        return `{"type": "IfStatement", "condition": ${this.condition.toJsonString()}, "body": ${this.body === null ? "null" : this.body!.toJsonString()}, "else": ${this.else === null ? "null" : this.else!.toJsonString()}, "lineNum": ${this.lineNum}}`;
    }

}

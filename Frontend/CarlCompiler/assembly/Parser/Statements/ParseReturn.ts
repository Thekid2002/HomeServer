import {ParseAbstractStatement} from "./ParseAbstractStatement";
import {ParseVisitor} from "../ParseVisitor";
import {ParseAbstractExpression} from "../Expressions/ParseAbstractExpression";

export class ParseReturn extends ParseAbstractStatement {
    expression: ParseAbstractExpression;

    constructor(expression: ParseAbstractExpression, lineNum: i32) {
        super(lineNum);
        this.expression = expression;
    }

    toJsonString(): string {
        let string = "{\n";
        string += "\"type\": \"Return\",\n";
        string += "\"expression\": " + this.expression.toJsonString() + ",\n";
        string += "\"line\": " + this.lineNum + "\n";
        string += "}";
        return string;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitReturn(this);
    }
}
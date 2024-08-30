import { ParseAbstractStatement } from "./ParseAbstractStatement";
import { ParseIdentifier } from "../Expressions/Terms/ParseIdentifier";
import { ParseVisitor } from "../ParseVisitor";

export class ParseIncrement extends ParseAbstractStatement {
    identifier: ParseIdentifier;
    operator: string;

    constructor(identifier: ParseIdentifier, operator: string, lineNum: i32) {
        super(lineNum);
        this.identifier = identifier;
        this.operator = operator;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitIncrement(this);
    }

    toJsonString(): string {
        return (
            "{\n\"type\": \"Increment\",\n\"identifier\": " +
      this.identifier.toJsonString() +
      ",\n\"operator\": \"" +
      this.operator +
      "\",\n\"line\": " +
      this.lineNum +
      "\n}"
        );
    }
}

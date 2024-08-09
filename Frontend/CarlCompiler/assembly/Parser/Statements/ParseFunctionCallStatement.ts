import { ParseVisitor } from "../ParseVisitor";
import {ParseAbstractStatement} from "./ParseAbstractStatement";
import {ParseAbstractExpression} from "../Expressions/ParseAbstractExpression";
import {Token} from "../../Lexer/Token";

export class ParseFunctionCallStatement extends ParseAbstractStatement {
    functionName: Token;
    actualParameters: Array<ParseAbstractExpression>;

    constructor(functionName: Token, actualParameters: Array<ParseAbstractExpression>, lineNum: i32) {
        super(lineNum);
        this.functionName = functionName;
        this.actualParameters = actualParameters;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitFunctionCallStatement(this);
    }

    toJsonString(): string {
        let string = "{\n";
        string += "\"type\": \"FunctionCall\",\n";
        string += "\"functionName\": \"" + this.functionName + "\",\n";
        string += "\"actualParameters\": [";
        for (let i = 0; i < this.actualParameters.length; i++) {
            string += this.actualParameters[i].toJsonString();
            if (i < this.actualParameters.length - 1) {
                string += ", ";
            }
        }
        string += "],\n";
        string += "\"line\": " + this.lineNum + "\n";
        string += "}";
        return string;
    }

}
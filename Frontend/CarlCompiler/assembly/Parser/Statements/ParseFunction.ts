import { ParseVisitor } from "../ParseVisitor";
import {ParseAbstractStatement} from "./ParseAbstractStatement";
import {ParseIdentifier} from "../Expressions/Terms/ParseIdentifier";
import {ParseType} from "../Expressions/Terms/ParseType";

export class ParseFunction extends ParseAbstractStatement {
    public returnType: ParseType;
    public name: ParseIdentifier;
    public parameters: Map<ParseIdentifier, ParseType>
    public body: ParseAbstractStatement;
    public export: boolean;

    constructor(returnType: ParseType, name: ParseIdentifier, parameters: Map<ParseIdentifier, ParseType>, body: ParseAbstractStatement, $export: boolean, lineNum: i32) {
        super(lineNum);
        this.returnType = returnType;
        this.name = name;
        this.parameters = parameters;
        this.body = body;
        this.export = $export;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitFunction(this);
    }
    toJsonString(): string {
        let string = `{"type": "Function", "returnType": ${this.returnType.toJsonString()}, "name": ${this.name.toJsonString()}, "parameters": [`;
        let i = 0;
        for (let j = 0; j < this.parameters.keys().length; j++) {
            let key = this.parameters.keys()[j];
            string += `{"${key}": ${this.parameters.get(key).toJsonString()}, "type": ${this.parameters.get(key).toJsonString()}}`;
            if (i < this.parameters.keys().length - 1) {
                string += ", ";
            }
            i++;
        }
        string += "], \"body\": [";
        string += this.body.toJsonString();
        string += "]" +
            "\"export\": " + this.export + "}";
        return string;
    }
}
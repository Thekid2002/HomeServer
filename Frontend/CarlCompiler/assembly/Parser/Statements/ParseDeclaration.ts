import {ParseAbstractStatement} from "./ParseAbstractStatement";
import {ParseVisitor} from "../ParseVisitor";
import {ParseIdentifier} from "../Expressions/Terms/ParseIdentifier";
import {ParseAbstractExpression} from "../Expressions/ParseAbstractExpression";
import {ParseType} from "../Expressions/Terms/ParseType";

export class ParseDeclaration extends ParseAbstractStatement {
    identifier: ParseIdentifier;
    type: ParseType;
    expression: ParseAbstractExpression | null;
    export: boolean;
    global: boolean;

    constructor(identifier: ParseIdentifier, type: ParseType, expression: ParseAbstractExpression | null, $export: boolean, global: boolean, lineNum: i32) {
        super(lineNum);
        this.identifier = identifier;
        this.type = type;
        this.expression = expression;
        this.export = $export;
        this.global = global;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitDeclaration(this);
    }

    toJsonString(): string {
        return `{"type": "Declaration", "identifier": ${this.identifier.toJsonString()},` +
            `"type": ${this.type.toJsonString()},` +
            `"export": ${this.export},` +
            `"expression": ${this.expression ? this.expression!.toJsonString() : "\"\""}}`;
    }
}

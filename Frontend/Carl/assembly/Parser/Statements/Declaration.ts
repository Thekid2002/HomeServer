import {AbstractStatement} from "./AbstractStatement";
import {ParseVisitor} from "../ParseVisitor";
import {Identifier} from "../Expressions/Terms/Identifier";
import {AbstractExpression} from "../Expressions/AbstractExpression";
import {Type} from "../Expressions/Terms/Type";

export class Declaration extends AbstractStatement {
    identifier: Identifier;
    type: Type;
    expression: AbstractExpression | null;

    constructor(identifier: Identifier, type: Type, expression: AbstractExpression | null, lineNum: i32) {
        super(lineNum);
        this.identifier = identifier;
        this.type = type;
        this.expression = expression;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitDeclaration(this);
    }

    toJsonString(): string {
        return `{"type": "Declaration", "identifier": ${this.identifier.toJsonString()},` +
            `"type": ${this.type.toJsonString()},` +
            `"expression": ${this.expression ? this.expression!.toJsonString() : "\"\""}}`;
    }
}

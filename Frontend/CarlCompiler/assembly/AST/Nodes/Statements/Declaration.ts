import {AbstractStatement} from "./AbstractStatement";
import {Identifier} from "../Expressions/Terms/Identifier";
import {ValueType} from "../Types/ValueType";
import {AbstractExpression} from "../Expressions/AbstractExpression";
import {ASTVisitor} from "../../ASTVisitor";

export class Declaration extends AbstractStatement {
    identifier: Identifier;
    type: ValueType;
    expression: AbstractExpression | null;
    export: boolean;

    constructor(identifier: Identifier, type: ValueType, expression: AbstractExpression | null, $export: boolean, lineNum: i32) {
        super(lineNum);
        this.identifier = identifier;
        this.type = type;
        this.expression = expression;
        this.export = $export;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitDeclaration(this);
    }

    clone(): AbstractStatement {
        return new Declaration(this.identifier.clone() as Identifier, this.type, this.expression == null ? null : this.expression!.clone() as AbstractExpression, this.export, this.lineNum);
    }

    toString(): string {
        return "Declaration(" + this.identifier.toString() + ", " + this.type.toString() + (this.expression == null ? "" : ", " + this.expression!.toString()) + ")";
    }
}

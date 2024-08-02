import {AbstractStatement} from "./AbstractStatement";
import {AbstractExpression} from "../Expressions/AbstractExpression";
import {ASTVisitor} from "../../ASTVisitor";
import {Declaration} from "./Declaration";
import {Identifier} from "../Expressions/Terms/Identifier";

export class While extends AbstractStatement {
    declaration: Declaration | null;
    condition: AbstractExpression;
    body: AbstractStatement | null;
    liveVariables: Array<string> = [];

    constructor(declaration: Declaration | null, condition: AbstractExpression, body: AbstractStatement, lineNum: i32) {
        super(lineNum);
        this.condition = condition;
        this.body = body;
        this.declaration = declaration
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitWhile(this);
    }
}

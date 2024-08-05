import {AbstractStatement} from "./AbstractStatement";
import {AbstractExpression} from "../Expressions/AbstractExpression";
import {ASTVisitor} from "../../ASTVisitor";
import {Declaration} from "./Declaration";
import {Identifier} from "../Expressions/Terms/Identifier";
import {AbstractNode} from "../AbstractNode";

export class While extends AbstractStatement {
    declaration: Declaration | null;
    condition: AbstractExpression;
    body: AbstractStatement | null;

    constructor(declaration: Declaration | null, condition: AbstractExpression, body: AbstractStatement | null, lineNum: i32) {
        super(lineNum);
        this.condition = condition;
        this.body = body;
        this.declaration = declaration
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitWhile(this);
    }

    clone(): AbstractNode {
        let $while = new While(
            this.declaration !== null ? this.declaration!.clone() as Declaration : null,
            this.condition.clone() as AbstractExpression,
            this.body !== null ? this.body!.clone() as AbstractStatement : null,
            this.lineNum
        )
        return $while;
    }

    toString(): string {
        return "While(" + (this.declaration !== null ? this.declaration!.toString() : "null") + ", " + this.condition.toString() + ", " + (this.body !== null ? this.body!.toString() : "null") + ")";
    }
}

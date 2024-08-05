import { ASTVisitor } from "../../ASTVisitor";
import {AbstractStatement} from "./AbstractStatement";
import {AbstractExpression} from "../Expressions/AbstractExpression";

export class IfStatement extends AbstractStatement {
    condition: AbstractExpression;
    body: AbstractStatement | null;
    else: AbstractStatement | null;

    constructor(condition: AbstractExpression, body: AbstractStatement | null, $else: AbstractStatement | null, line: i32) {
        super(line);
        this.condition = condition;
        this.body = body;
        this.else = $else;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitIfStatement(this);
    }

    clone(): IfStatement {
        let $if = new IfStatement(
            this.condition.clone() as AbstractExpression,
            this.body !== null ? this.body!.clone() as AbstractStatement : null,
            this.else !== null ? this.else!.clone() as AbstractStatement : null,
            this.lineNum
        )
        return $if;
    }

    toString(): string {
        return "IfStatement(" + this.condition.toString() + ", " + (this.body !== null ? this.body!.toString() : "null") + ", " + (this.else !== null ? this.else!.toString() : "null") + ")";
    }
}

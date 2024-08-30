import { AbstractExpression } from "../AbstractExpression";

export abstract class AbstractTerm extends AbstractExpression {
    value: string;

    constructor(lineNum: i32, value: string) {
        super(lineNum);
        this.value = value;
    }
}

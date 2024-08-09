import {AbstractStatement} from "./AbstractStatement";
import {ASTVisitor} from "../../ASTVisitor";
import { AbstractNode } from "../AbstractNode";
import {AbstractExpression} from "../Expressions/AbstractExpression";

export class FunctionCallStatement extends AbstractStatement {
    functionName: string;
    actualParameters: Array<AbstractExpression>;

    constructor(functionName: string, actualParameters: Array<AbstractExpression>, lineNum: i32) {
        super(lineNum);
        this.functionName = functionName;
        this.actualParameters = actualParameters;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitFunctionCallStatement(this);
    }

    clone(): AbstractNode {
        let functionNameClone = this.functionName;
        let actualParametersClone = new Array<AbstractExpression>();
        for (let i = 0; i < this.actualParameters.length; i++) {
            actualParametersClone.push(this.actualParameters[i].clone() as AbstractExpression);
        }
        return new FunctionCallStatement(functionNameClone, actualParametersClone, this.lineNum);
    }

    toString(): string {
        let string = this.functionName + "(";
        for (let i = 0; i < this.actualParameters.length; i++) {
            string += this.actualParameters[i].toString();
            if (i < this.actualParameters.length - 1) {
                string += ", ";
            }
        }
        string += ")";
        return string;
    }
}
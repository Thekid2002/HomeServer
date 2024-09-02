import { AbstractStatement } from "./AbstractStatement";
import { ASTVisitor } from "../../ASTVisitor";
import { AbstractNode } from "../AbstractNode";
import { AbstractExpression } from "../Expressions/AbstractExpression";
import { AbstractType } from "../Types/AbstractType";
import { FunctionCallInterface } from "../FunctionCallInterface";

export class FunctionCallStatement
    extends AbstractStatement
    implements FunctionCallInterface
{
    actualParameters: Array<AbstractExpression>;
    expectedParameters: Array<AbstractType> | null = null;
    functionName: string;

    constructor(
        functionName: string,
        actualParameters: Array<AbstractExpression>,
        lineNum: i32
    ) {
        super(lineNum);
        this.functionName = functionName;
        this.actualParameters = actualParameters;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitFunctionCallStatement(this);
    }

    clone(): AbstractNode {
        const functionNameClone = this.functionName;
        const actualParametersClone = new Array<AbstractExpression>();
        for (let i = 0; i < this.actualParameters.length; i++) {
            actualParametersClone.push(
        this.actualParameters[i].clone() as AbstractExpression
            );
        }
        return new FunctionCallStatement(
            functionNameClone,
            actualParametersClone,
            this.lineNum
        );
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

import {AbstractExpression} from "./AbstractExpression";
import {ASTVisitor} from "../../ASTVisitor";

export class FunctionCallExpression extends AbstractExpression {
    functionName: string;
    actualParameters: Array<AbstractExpression>;

    constructor(functionName: string, actualParameters: Array<AbstractExpression>, lineNum: i32) {
        super(lineNum);
        this.functionName = functionName;
        this.actualParameters = actualParameters;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitFunctionCallExpression(this);
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

    clone(): FunctionCallExpression {
        let functionNameClone = this.functionName;
        let actualParametersClone = new Array<AbstractExpression>();
        for (let i = 0; i < this.actualParameters.length; i++) {
            actualParametersClone.push(this.actualParameters[i].clone() as AbstractExpression);
        }
        return new FunctionCallExpression(functionNameClone, actualParametersClone, this.lineNum);
    }
}
import {AbstractExpression} from "./Expressions/AbstractExpression";
import {AbstractType} from "./Types/AbstractType";

export interface FunctionCallInterface {
    functionName: string;
    actualParameters: Array<AbstractExpression>;
    expectedParameters: Array<AbstractType> | null;
    lineNum: i32;
}
import {AbstractNode} from "../AbstractNode";
import {ValueType, ValueTypeEnum} from "../Types/ValueType";
import {AbstractType} from "../Types/AbstractType";

export abstract class AbstractExpression extends AbstractNode {
    type: ValueType | null = null;
}

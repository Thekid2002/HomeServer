import {AbstractNode} from "../AbstractNode";
import {ValueTypeEnum} from "../Types/ValueType";

export abstract class AbstractExpression extends AbstractNode {
    type: ValueTypeEnum = ValueTypeEnum.DOUBLE;
}

import {FuncObject} from "./FuncObject";
import {Identifier} from "../../AST/Nodes/Expressions/Terms/Identifier";
import {AbstractStatement} from "../../AST/Nodes/Statements/AbstractStatement";
import {ValueType} from "../../AST/Nodes/Types/ValueType";

export class Function extends FuncObject {
    public name: Identifier;
    public params: Map<string, ValueType>
    public body: AbstractStatement;

    constructor(name: Identifier, params: Map<string, ValueType>, body: AbstractStatement) {
        super();
        this.name = name;
        this.params = params;
        this.body = body;
    }
}

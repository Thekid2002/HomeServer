"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueTypeNames = exports.ValueTypeEnum = exports.ValueType = void 0;
const AbstractType_1 = require("./AbstractType");
class ValueType extends AbstractType_1.AbstractType {
    constructor(type, lineNum) {
        super(lineNum);
        this.type = type;
    }
    accept(visitor) {
        return visitor.visitValueType(this);
    }
    toString() {
        switch (this.type) {
        case ValueTypeEnum.Error:
            return "Error";
        case ValueTypeEnum.DOUBLE:
            return "f64";
        case ValueTypeEnum.INT:
            return "i32";
        case ValueTypeEnum.BOOL:
            return "i32";
        case ValueTypeEnum.STRING:
            return "string";
        default:
            return "Unknown";
        }
    }
    toJsonString() {
        return `{ "type": "${this.type}" }`;
    }
    clone() {
        return new ValueType(this.type, this.lineNum);
    }
}
exports.ValueType = ValueType;
var ValueTypeEnum;
(function (ValueTypeEnum) {
    ValueTypeEnum[ValueTypeEnum["Error"] = 0] = "Error";
    ValueTypeEnum[ValueTypeEnum["INT"] = 1] = "INT";
    ValueTypeEnum[ValueTypeEnum["DOUBLE"] = 2] = "DOUBLE";
    ValueTypeEnum[ValueTypeEnum["BOOL"] = 3] = "BOOL";
    ValueTypeEnum[ValueTypeEnum["STRING"] = 4] = "STRING";
})(ValueTypeEnum || (exports.ValueTypeEnum = ValueTypeEnum = {}));
exports.ValueTypeNames = [
    "Error",
    "INT",
    "DOUBLE",
    "BOOL",
    "STRING"
];

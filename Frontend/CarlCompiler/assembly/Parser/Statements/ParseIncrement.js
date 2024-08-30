"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseIncrement = void 0;
const ParseAbstractStatement_1 = require("./ParseAbstractStatement");
class ParseIncrement extends ParseAbstractStatement_1.ParseAbstractStatement {
    constructor(identifier, operator, lineNum) {
        super(lineNum);
        this.identifier = identifier;
        this.operator = operator;
    }
    accept(visitor) {
        return visitor.visitIncrement(this);
    }
    toJsonString() {
        return ("{\n\"type\": \"Increment\",\n\"identifier\": " +
            this.identifier.toJsonString() +
            ",\n\"operator\": \"" +
            this.operator +
            "\",\n\"line\": " +
            this.lineNum +
            "\n}");
    }
}
exports.ParseIncrement = ParseIncrement;

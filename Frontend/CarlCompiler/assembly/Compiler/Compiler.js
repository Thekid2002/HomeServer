"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const UnaryExpression_1 = require("../AST/Nodes/Expressions/UnaryExpression");
const BinaryExpression_1 = require("../AST/Nodes/Expressions/BinaryExpression");
const Identifier_1 = require("../AST/Nodes/Expressions/Terms/Identifier");
const Int_1 = require("../AST/Nodes/Expressions/Terms/Int");
const ValueType_1 = require("../AST/Nodes/Types/ValueType");
const Declaration_1 = require("../AST/Nodes/Statements/Declaration");
const While_1 = require("../AST/Nodes/Statements/While");
const Assignment_1 = require("../AST/Nodes/Statements/Assignment");
const IfStatement_1 = require("../AST/Nodes/Statements/IfStatement");
const CompoundStatement_1 = require("../AST/Nodes/Statements/CompoundStatement");
const ASTString_1 = require("../AST/Nodes/Expressions/Terms/ASTString");
const Bool_1 = require("../AST/Nodes/Expressions/Terms/Bool");
const FunctionDeclaration_1 = require("../AST/Nodes/Statements/FunctionDeclaration");
const StatementType_1 = require("../AST/Nodes/Types/StatementType");
const FunctionCallStatement_1 = require("../AST/Nodes/Statements/FunctionCallStatement");
const FunctionCallExpression_1 = require("../AST/Nodes/Expressions/FunctionCallExpression");
const Return_1 = require("../AST/Nodes/Statements/Return");
const VarEnv_1 = require("../Env/VarEnv");
const ImportFunction_1 = require("../AST/Nodes/Statements/ImportFunction");
const Double_1 = require("../AST/Nodes/Expressions/Terms/Double");
class Compiler {
    constructor() {
        this.wasmCode = [];
        this.globalDeclarations = [];
        this.functionDeclarations = [];
        this.imports = [];
        this.funcCount = 0;
        this.stackPointer = 0;
        this.globalDeclarations = [];
        this.functionDeclarations = [];
        this.functionDeclarations.push("(func $mod (param $x f64) (param $y f64) (result f64)\n" +
            "(local $quotient f64)\n" +
            "(local $product f64)\n" +
            ";; Calculate the quotient\n" +
            "local.get $x\n" +
            "local.get $y\n" +
            "f64.div\n" +
            "f64.floor\n" +
            "local.set $quotient\n" +
            "\n" +
            ";; Calculate the product of the quotient and the divisor\n" +
            "local.get $quotient\n" +
            "local.get $y\n" +
            "f64.mul\n" +
            "local.set $product\n" +
            "\n" +
            ";; Subtract the product from the original number to get the remainder\n" +
            "local.get $x\n" +
            "local.get $product\n" +
            "f64.sub\n" +
            ")");
    }
    compileAbstractStatement(statement) {
        if (statement instanceof Declaration_1.Declaration) {
            return this.compileDeclaration(statement);
        }
        if (statement instanceof While_1.While) {
            return this.compileWhile(statement);
        }
        if (statement instanceof IfStatement_1.IfStatement) {
            return this.compileIfStatement(statement);
        }
        if (statement instanceof CompoundStatement_1.CompoundStatement) {
            return this.compileCompoundStatement(statement);
        }
        if (statement instanceof Assignment_1.Assignment) {
            return this.compileAssignment(statement);
        }
        if (statement instanceof ImportFunction_1.ImportFunction) {
            return this.compileImport(statement);
        }
        if (statement instanceof FunctionDeclaration_1.FunctionDeclaration) {
            return this.compileFunctionDeclaration(statement);
        }
        if (statement instanceof FunctionCallStatement_1.FunctionCallStatement) {
            return this.compileFunctionCall(statement);
        }
        if (statement instanceof Return_1.Return) {
            return this.compileReturnStatement(statement);
        }
        throw new Error("Unknown statement type");
    }
    compileString(term) {
        let value = term.value + "nul!ll>";
        let memoryLocation = this.stackPointer;
        let length = term.value.length;
        this.stackPointer += length + 1;
        this.globalDeclarations.push(`(data (i32.const ${memoryLocation}) "${value}")`);
        return `i32.const ${memoryLocation}`;
    }
    compileCompoundStatement(statement) {
        let left = this.compileAbstractStatement(statement.left);
        let right = this.compileAbstractStatement(statement.right);
        return `${left}\n${right}`;
    }
    compileIfStatement(statement) {
        let condition = this.compileAbstractExpression(statement.condition);
        let body = "";
        if (statement.body !== null) {
            body = this.compileAbstractStatement(statement.body);
        }
        let $else = "";
        if (statement.else !== null) {
            $else = this.compileAbstractStatement(statement.else);
        }
        return ("" +
            `${condition}\n` +
            "(if\n" +
            "(then\n" +
            `${body}\n` +
            ")\n" +
            "(else\n" +
            `${$else}\n` +
            ")\n" +
            ")\n");
    }
    compileAssignment(statement) {
        let expr = this.compileAbstractExpression(statement.expression);
        if (VarEnv_1.VarEnv.globalVars.has(statement.identifier.value)) {
            return `${expr}\nglobal.set $${statement.identifier.value}`;
        }
        return `${expr}\nlocal.set $${statement.identifier.value}`;
    }
    compileWhile(statement) {
        let start = this.funcCount;
        this.funcCount++;
        let initiator = "";
        if (statement.initiator !== null) {
            initiator = this.compileAbstractStatement(statement.initiator);
        }
        let condition = this.compileAbstractExpression(statement.condition);
        let body = this.compileAbstractStatement(statement.body);
        return (`${initiator}` +
            "\n" +
            `${condition}\n` +
            "(if \n" +
            "(then \n" +
            "\n(loop $while" +
            `${start}` +
            "\n" +
            `${body}` +
            "\n" +
            `${condition}` +
            "\n" +
            "\n(br_if $while" +
            `${start}` +
            ")\n" +
            ")\n" +
            ")\n" +
            ")\n");
    }
    compileImport(statement) {
        let parameters = "(param ";
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            let type = this.compileAbstractType(statement.parameters.get(key));
            parameters += `${type} `;
        }
        parameters += ")";
        let returnType = "(result " + this.compileAbstractType(statement.returnType) + ")";
        let $import = `(import "${statement.parentPath}" "${statement.childPath}" (func $${statement.name.value} ${parameters} ${returnType}))`;
        this.imports.push($import);
        return "";
    }
    compileProgram(statement) {
        if (statement.body !== null) {
            this.compileAbstractStatement(statement.body);
        }
        return ("(module\n" +
            this.imports.join("\n") +
            "\n" +
            "(import \"js\" \"memory\" (memory 1))\n" +
            `(global $stackPointer (export "stackPointer") (mut i32) (i32.const ${this.stackPointer}))\n` +
            this.globalDeclarations.join("\n") +
            "\n" +
            this.functionDeclarations.join("\n") +
            "\n" +
            ")");
    }
    compileAbstractExpression(expression) {
        if (expression instanceof UnaryExpression_1.UnaryExpression) {
            return this.compileUnaryExpression(expression);
        }
        if (expression instanceof BinaryExpression_1.BinaryExpression) {
            return this.compileBinaryExpression(expression);
        }
        if (expression instanceof Identifier_1.Identifier) {
            return this.compileIdentifier(expression);
        }
        if (expression instanceof Bool_1.Bool) {
            return this.compileBool(expression);
        }
        if (expression instanceof Int_1.Int) {
            return this.compileInt(expression);
        }
        if (expression instanceof Double_1.Double) {
            return this.compileDouble(expression);
        }
        if (expression instanceof ASTString_1.ASTString) {
            return this.compileString(expression);
        }
        if (expression instanceof FunctionCallExpression_1.FunctionCallExpression) {
            return this.compileFunctionCall(expression);
        }
        throw new Error("Unknown abstract expression type");
    }
    compileUnaryExpression(expression) {
        let right = this.compileAbstractExpression(expression.primaryOrRight);
        if (expression.operator === "-") {
            right = `${right}\nf64.neg`;
        }
        if (expression.operator === "!") {
            right = `${right}\ni32.eqz`;
        }
        if (expression.type.type === ValueType_1.ValueTypeEnum.STRING &&
            expression.primaryOrRight.type.type === ValueType_1.ValueTypeEnum.DOUBLE) {
            right = `${right}\ncall $toStringDouble`;
        }
        if (expression.type.type === ValueType_1.ValueTypeEnum.STRING &&
            expression.primaryOrRight.type.type === ValueType_1.ValueTypeEnum.INT) {
            right = `${right}\ncall $toStringInt`;
        }
        return `${right}\n`;
    }
    compileBinaryExpression(expression) {
        let rightValueType = expression.right.type;
        let leftValueType = expression.primaryOrLeft.type;
        if (rightValueType === null) {
            throw new Error("Right value type is null: " +
                expression.right.toString() +
                " on line: " +
                expression.lineNum.toString());
        }
        if (leftValueType === null) {
            throw new Error("Left value type is null: " +
                expression.primaryOrLeft.toString() +
                " on line: " +
                expression.lineNum.toString());
        }
        let rightType = rightValueType.type;
        let leftType = leftValueType.type;
        if (leftType === ValueType_1.ValueTypeEnum.STRING &&
            rightType === ValueType_1.ValueTypeEnum.STRING) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\n${right}\ncall $concat`;
        }
        if (leftType === ValueType_1.ValueTypeEnum.STRING &&
            rightType === ValueType_1.ValueTypeEnum.DOUBLE) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\n${right}\ncall $toStringDouble\ncall $concat`;
        }
        if (leftType === ValueType_1.ValueTypeEnum.STRING && rightType === ValueType_1.ValueTypeEnum.INT) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\n${right}\ncall $toStringInt\ncall $concat`;
        }
        if (leftType === ValueType_1.ValueTypeEnum.DOUBLE &&
            rightType === ValueType_1.ValueTypeEnum.STRING) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\ncall $toStringDouble\n${right}\ncall $concat`;
        }
        if (leftType === ValueType_1.ValueTypeEnum.INT && rightType === ValueType_1.ValueTypeEnum.STRING) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\ncall $toStringInt\n${right}\ncall $concat`;
        }
        if (leftType === ValueType_1.ValueTypeEnum.INT && rightType === ValueType_1.ValueTypeEnum.DOUBLE) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\nf64.convert_i32_s\n${right}\n${this.getOperator(expression.operator, expression.type.type)}`;
        }
        if (leftType === ValueType_1.ValueTypeEnum.DOUBLE && rightType === ValueType_1.ValueTypeEnum.INT) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\n${right}\nf64.convert_i32_s\n${this.getOperator(expression.operator, expression.type.type)}`;
        }
        let left = this.compileAbstractExpression(expression.primaryOrLeft);
        let right = this.compileAbstractExpression(expression.right);
        return `${left}\n${right}\n${this.getOperator(expression.operator, expression.type.type)}`;
    }
    compileIdentifier(term) {
        if (VarEnv_1.VarEnv.globalVars.has(term.value)) {
            return `global.get $${term.value}`;
        }
        return `local.get $${term.value}`;
    }
    compileInt(term) {
        return `i32.const ${term.value}`;
    }
    compileDouble(term) {
        return `f64.const ${term.value}`;
    }
    compileDeclaration(statement) {
        let string = "";
        if (statement.expression !== null) {
            let expr = this.compileAbstractExpression(statement.expression);
            if (statement.global) {
                string += `\n${expr}\nglobal.set $${statement.identifier.value}`;
                this.globalDeclarations.push(`(global $${statement.identifier.value} (export "${statement.identifier.value}") (mut ${this.compileValueType(statement.type)}) (${expr}))`);
            }
            else {
                string += `\n${expr}\nlocal.set $${statement.identifier.value}`;
            }
        }
        return string;
    }
    compileFunctionDeclaration(statement) {
        let body = "";
        if (statement.varEnv !== null) {
            body += statement.varEnv.getDeclarations(statement.parameters.keys());
        }
        if (statement.body !== null) {
            body += this.compileAbstractStatement(statement.body);
        }
        let params = "";
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            let type = statement.parameters.get(key);
            params += `(param $${key} ${this.compileAbstractType(type)})\n`;
        }
        let functionIdentifier = statement.export
            ? `$${statement.name.value} (export "${statement.name.value}")`
            : `$${statement.name.value}`;
        let returnType = this.compileAbstractType(statement.returnType);
        let $functionNameAndParameters = `(func ${functionIdentifier} ${params} (result ${returnType})`;
        let $function = `${$functionNameAndParameters}\n` + `${body}\n` + ")";
        this.functionDeclarations.push($function);
        return "";
    }
    compileValueType(type) {
        if (type.type === ValueType_1.ValueTypeEnum.DOUBLE) {
            return "f64";
        }
        if (type.type === ValueType_1.ValueTypeEnum.INT) {
            return "i32";
        }
        if (type.type === ValueType_1.ValueTypeEnum.BOOL) {
            return "i32";
        }
        if (type.type === ValueType_1.ValueTypeEnum.STRING) {
            return "i32";
        }
        throw new Error("Unknown type: " + type.type.toString());
    }
    getOperator(operator, type) {
        if (operator === "+") {
            if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "f64.add";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.add";
            }
        }
        if (operator === "-") {
            if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "f64.sub";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.sub";
            }
        }
        if (operator === "*") {
            if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "f64.mul";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.mul";
            }
        }
        if (operator === "/") {
            if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "f64.div";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.div_s";
            }
        }
        if (operator === "%") {
            if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "call $mod";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.rem_s";
            }
        }
        if (operator === "==") {
            if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "f64.eq";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.eq";
            }
        }
        if (operator === "!=") {
            if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "f64.ne";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.ne";
            }
        }
        if (operator === ">") {
            if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "f64.gt";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.gt_s";
            }
        }
        if (operator === "<") {
            if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "f64.lt";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.lt_s";
            }
        }
        if (operator === ">=") {
            if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "f64.ge";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.ge_s";
            }
        }
        if (operator === "<=") {
            if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "f64.le";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.le_s";
            }
        }
        if (operator === "==") {
            if (type === ValueType_1.ValueTypeEnum.BOOL) {
                return "i32.eq";
            }
            else if (type === ValueType_1.ValueTypeEnum.INT) {
                return "i32.eq";
            }
            else if (type === ValueType_1.ValueTypeEnum.DOUBLE) {
                return "f64.eq";
            }
            else if (type === ValueType_1.ValueTypeEnum.STRING) {
                return "i32.eq";
            }
        }
        if (operator === "&&") {
            return "i32.and";
        }
        if (operator === "||") {
            return "i32.or";
        }
        throw new Error("Unknown operator: " + operator + " for type: " + ValueType_1.ValueTypeNames[type]);
    }
    compileBool(term) {
        if (term.value === "true") {
            return "i32.const 1";
        }
        return "i32.const 0";
    }
    compileAbstractType(abstractType) {
        if (abstractType instanceof ValueType_1.ValueType) {
            return this.compileValueType(abstractType);
        }
        if (abstractType instanceof StatementType_1.StatementType) {
            let statementType = abstractType;
            if (statementType.type === StatementType_1.StatementTypeEnum.VOID) {
                return "";
            }
        }
        throw new Error("Unknown abstract type");
    }
    compileFunctionCall(functionCall) {
        let actualParameters = "";
        for (let i = 0; i < functionCall.actualParameters.length; i++) {
            let expr = this.compileAbstractExpression(functionCall.actualParameters[i]);
            actualParameters += `${expr}\n`;
            let expectedType = functionCall.expectedParameters !== null
                ? functionCall.expectedParameters[i]
                : null;
            if (expectedType == null) {
                return `${actualParameters}\ncall $${functionCall.functionName}`;
            }
            // Handle conversion from DOUBLE (f64) to INT (i32)
            if (functionCall.actualParameters[i].type.type === ValueType_1.ValueTypeEnum.DOUBLE &&
                expectedType.type === ValueType_1.ValueTypeEnum.INT) {
                actualParameters += "f64.convert_i32_s\n";
            }
            // Handle conversion from INT (i32) to DOUBLE (f64)
            if (functionCall.actualParameters[i].type.type === ValueType_1.ValueTypeEnum.INT &&
                expectedType.type === ValueType_1.ValueTypeEnum.DOUBLE) {
                actualParameters += "i32.trunc_f64_s\n";
            }
            // Handle conversion from INT (i32) to STRING
            if (functionCall.actualParameters[i].type.type === ValueType_1.ValueTypeEnum.INT &&
                expectedType.type === ValueType_1.ValueTypeEnum.STRING) {
                actualParameters += "call $toStringInt\n";
            }
            // Handle conversion from DOUBLE (f64) to STRING
            if (functionCall.actualParameters[i].type.type === ValueType_1.ValueTypeEnum.DOUBLE &&
                expectedType.type === ValueType_1.ValueTypeEnum.STRING) {
                actualParameters += "call $toStringDouble\n";
            }
            // Handle conversion from BOOL (i32) to STRING
            if (functionCall.actualParameters[i].type.type === ValueType_1.ValueTypeEnum.BOOL &&
                expectedType.type === ValueType_1.ValueTypeEnum.STRING) {
                actualParameters += "call $toStringBool\n";
            }
        }
        return `${actualParameters}\ncall $${functionCall.functionName}`;
    }
    compileReturnStatement(statement) {
        let expr = this.compileAbstractExpression(statement.expression);
        return `${expr}\nreturn`;
    }
}
exports.Compiler = Compiler;

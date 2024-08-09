import { UnaryExpression } from "../AST/Nodes/Expressions/UnaryExpression";
import { BinaryExpression } from "../AST/Nodes/Expressions/BinaryExpression";
import { Identifier } from "../AST/Nodes/Expressions/Terms/Identifier";
import { Num } from "../AST/Nodes/Expressions/Terms/Num";
import { Term } from "../AST/Nodes/Expressions/Terms/Term";
import {ValueType, ValueTypeEnum, ValueTypeNames} from "../AST/Nodes/Types/ValueType";
import { Declaration } from "../AST/Nodes/Statements/Declaration";
import { Program } from "../AST/Nodes/Statements/Program";
import { Print } from "../AST/Nodes/Statements/Print";
import { While } from "../AST/Nodes/Statements/While";
import { Assignment } from "../AST/Nodes/Statements/Assignment";
import { IfStatement } from "../AST/Nodes/Statements/IfStatement";
import { CompoundStatement } from "../AST/Nodes/Statements/CompoundStatement";
import {ASTString} from "../AST/Nodes/Expressions/Terms/ASTString";
import {AbstractExpression} from "../AST/Nodes/Expressions/AbstractExpression";
import {AbstractStatement} from "../AST/Nodes/Statements/AbstractStatement";
import {Scan} from "../AST/Nodes/Statements/Scan";
import {Bool} from "../AST/Nodes/Expressions/Terms/Bool";
import {FunctionDeclaration} from "../AST/Nodes/Statements/FunctionDeclaration";
import {AbstractType} from "../AST/Nodes/Types/AbstractType";
import {StatementType, StatementTypeEnum} from "../AST/Nodes/Types/StatementType";
import {FunctionCallStatement} from "../AST/Nodes/Statements/FunctionCallStatement";
import {FunctionCallExpression} from "../AST/Nodes/Expressions/FunctionCallExpression";
import {Return} from "../AST/Nodes/Statements/Return";

export class Compiler {
    wasmCode: string[] = [];
    globalDeclarations: string[] = [];
    functionDeclarations: string[] = [];
    funcCount: i32 = 0;
    stackPointer: i32 = 0;

    constructor() {
        this.globalDeclarations = [];
        this.functionDeclarations = [];
        this.functionDeclarations.push('(func $mod (param $x f64) (param $y f64) (result f64)\n' +
            '(local $quotient f64)\n' +
            '(local $product f64)\n' +
            ';; Calculate the quotient\n' +
            'local.get $x\n' +
            'local.get $y\n' +
            'f64.div\n' +
            'f64.floor\n' +
            'local.set $quotient\n' +
            '\n' +
            ';; Calculate the product of the quotient and the divisor\n' +
            'local.get $quotient\n' +
            'local.get $y\n' +
            'f64.mul\n' +
            'local.set $product\n' +
            '\n' +
            ';; Subtract the product from the original number to get the remainder\n' +
            'local.get $x\n' +
            'local.get $product\n' +
            'f64.sub\n' +
            ')');
    }

    compileAbstractStatement(statement: AbstractStatement): string {
        if (statement instanceof Declaration) {
            return this.compileDeclaration(statement as Declaration);
        }

        if (statement instanceof Print) {
            return this.compilePrint(statement as Print);
        }

        if (statement instanceof Scan) {
            return this.compileScan(statement as Scan);
        }

        if (statement instanceof While) {
            return this.compileWhile(statement as While);
        }

        if (statement instanceof IfStatement) {
            return this.compileIfStatement(statement as IfStatement);
        }

        if (statement instanceof CompoundStatement) {
            return this.compileCompoundStatement(statement as CompoundStatement);
        }

        if (statement instanceof Assignment) {
            return this.compileAssignment(statement as Assignment);
        }

        if (statement instanceof FunctionDeclaration) {
            return this.compileFunctionDeclaration(statement as FunctionDeclaration);
        }

        if(statement instanceof FunctionCallStatement){
            return this.compileFunctionCallStatement(statement as FunctionCallStatement);
        }

        if(statement instanceof Return){
            return this.compileReturnStatement(statement as Return);
        }

        throw new Error("Unknown statement type");
    }

    compileString(term: ASTString): string {
        let value = term.value + "nul!ll>";
        let memoryLocation = this.stackPointer;
        let length = term.value.length;
        this.stackPointer += length+1;
        this.globalDeclarations.push(`(data (i32.const ${memoryLocation}) "${value}")`);
        return `i32.const ${memoryLocation}`;
    }

    compileCompoundStatement(statement: CompoundStatement): string {
        let left = this.compileAbstractStatement(statement.left);
        let right = this.compileAbstractStatement(statement.right);
        return `${left}\n${right}`;
    }

    compileIfStatement(statement: IfStatement): string {
        let condition = this.compileAbstractExpression(statement.condition);
        let body: string = "";
        if(statement.body !== null) {
            body = this.compileAbstractStatement(statement.body!);
        }

        let $else: string = "";
        if (statement.else !== null) {
            $else = this.compileAbstractStatement(statement.else!);
        }

        return '' +
            `${condition}\n` +
            `(if\n` +
            `(then\n` +
            `${body}\n` +
            ')\n' +
            `(else\n` +
            `${$else}\n` +
            ')\n' +
            ')\n';
    }

    compileAssignment(statement: Assignment): string {
        let expr = this.compileAbstractExpression(statement.expression);
        return `${expr}\nlocal.set $${statement.identifier.value}`;
    }

    compileWhile(statement: While): string {
        let start: i32 = this.funcCount;
        this.funcCount++;
        let declaration: string = "";
        if(statement.declaration !== null) {
            declaration = this.compileDeclaration(statement.declaration!);
        }
        let condition = this.compileAbstractExpression(statement.condition);

        let body: string = this.compileAbstractStatement(statement.body!);

        return`${declaration}` + `\n` +
            `${condition}\n` +
            '(if \n' +
            '(then \n' +
            '\n(loop $while' + `${start}` + '\n' +
            `${body}` + `\n` +
            `${condition}` + '\n' +
            '\n(br_if $while' + `${start}` + ')\n' +
            ')\n' +
            ')\n' +
            ')\n';
    }

    compilePrint(print: Print): string {
        let expr = this.compileAbstractExpression(print.expression);
        if(print.expression.type === ValueTypeEnum.NUM) {
            return `${expr}\ncall $logf64`;
        }
        if(print.expression.type === ValueTypeEnum.BOOL) {
            return `${expr}\ncall $logi32`;
        }

        if(print.expression.type === ValueTypeEnum.STRING) {
            return `${expr}\ncall $logMemory\n`;
        }

        throw new Error("Logging for type: " + ValueTypeNames[print.expression.type] + " not implemented");
    }

    compileScan(scan: Scan): string {
        let message = this.compileAbstractExpression(scan.message);
        let type = this.compileValueType(scan.type);
        if(type === "String") {
            return `${message}\n` +
                `call $scan${type}` + `\n` +
                `local.set $${scan.identifier.value}`;
        }

        return `${message}\n` +
                `call $scan${type}` + `\n` +
                `local.set $${scan.identifier.value}`;
    }

    compileProgram(statement: Program): string {
        let body: string = "";
        if(statement.body !== null) {
            body = this.compileAbstractStatement(statement.body!);
        }
        return '(module\n' +
            '(import "console" "logI32" (func $logi32 (param i32)))\n' +
            '(import "console" "logF64" (func $logf64 (param f64)))\n' +
            '(import "console" "logMemory" (func $logMemory (param i32)))\n' +
            '(import "js" "memory" (memory 1))\n' +
            '(import "js" "concat" (func $concat (param i32 i32) (result i32)))\n' +
            `(import "js" "toStringI32" (func $toStringi32 (param i32) (result i32)))\n` +
            `(import "js" "toStringF64" (func $toStringf64 (param f64) (result i32)))\n` +
            `(import "js" "scanI32" (func $scani32 (param i32) (result i32)))\n` +
            `(import "js" "scanF64" (func $scanf64 (param i32) (result f64)))\n` +
            `(import "js" "scanString" (func $scanString (param i32) (result i32)))\n` +
            `(global $stackPointer (export "stackPointer") (mut i32) (i32.const ${this.stackPointer}))\n` +
            this.globalDeclarations.join("\n") + '\n' +
            this.functionDeclarations.join("\n") + '\n' +
            ')';
    }
    
    compileAbstractExpression(expression: AbstractExpression): string {
        if (expression instanceof UnaryExpression) {
            return this.compileUnaryExpression(expression as UnaryExpression);
        }
        
        if (expression instanceof BinaryExpression) {
            return this.compileBinaryExpression(expression as BinaryExpression);
        }

        if (expression instanceof Identifier) {
            return this.compileIdentifier(expression as Identifier);
        }

        if(expression instanceof Bool) {
            return this.compileBool(expression as Bool);
        }

        if (expression instanceof Num) {
            return this.compileNumber(expression as Num);
        }

        if (expression instanceof Term) {
            return this.compileTerm(expression as Term);
        }

        if (expression instanceof ASTString) {
            return this.compileString(expression as ASTString);
        }

        if(expression instanceof FunctionCallExpression) {
            return this.compileFunctionCallExpression(expression as FunctionCallExpression);
        }

        throw new Error("Unknown abstract expression type");
    }

    compileUnaryExpression(expression: UnaryExpression): string {
        let right = this.compileAbstractExpression(expression.primaryOrRight);
        if (expression.operator === "-") {
            return `${right}\nf64.neg`;
        }

        if (expression.operator === "!") {
            return `${right}\ni32.eqz`;
        }
        throw new Error("Unknown operator: " + expression.operator);
    }

    compileBinaryExpression(expression: BinaryExpression): string {
        if(expression.primaryOrLeft.type === ValueTypeEnum.STRING && expression.right.type === ValueTypeEnum.STRING) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\n${right}\ncall $concat`;
        }

        if(expression.primaryOrLeft.type === ValueTypeEnum.STRING && expression.right.type !== ValueTypeEnum.STRING) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\n${right}\ncall $toStringf64\ncall $concat`;
        }

        if(expression.primaryOrLeft.type !== ValueTypeEnum.STRING && expression.right.type === ValueTypeEnum.STRING) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\ncall $toStringf64\n${right}\ncall $concat`;
        }

        let left = this.compileAbstractExpression(expression.primaryOrLeft);
        let right = this.compileAbstractExpression(expression.right);
        return `${left}\n${right}\n${this.getOperator(expression.operator)}`;
    }

    compileIdentifier(term: Identifier): string {
        return `local.get $${term.value}`;
    }

    compileNumber(term: Num): string {
        return `f64.const ${term.value}`;
    }

    compileTerm(term: Term): string {
        throw new Error("Term not implemented");
    }

    compileDeclaration(statement: Declaration): string {
        let string = "";
        if (statement.expression !== null) {
            let expr = this.compileAbstractExpression(statement.expression!);
            string += `\n${expr}\nlocal.set $${statement.identifier.value}`;
        }
        return string;
    }

    compileFunctionDeclaration(statement: FunctionDeclaration): string{
        let body: string = "";
        if(statement.varEnv !== null) {
            body += statement.varEnv!.getDeclarations(statement.parameters.keys());
        }
        if(statement.body !== null) {
            body += this.compileAbstractStatement(statement.body!);
        }
        let params = "";
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            let type = statement.parameters.get(key);
            params += `(param $${key} ${this.compileAbstractType(type!)})\n`;
        }
        let functionIdentifier =  statement.export ? "(export \"" + statement.name.value + "\")" : `$${statement.name.value}`;
        let returnType = this.compileAbstractType(statement.returnType);
        let $function = `(func ${functionIdentifier} ${params} (result ${returnType})\n` +
            `${body}\n` +
            `)`;
        this.functionDeclarations.push($function);
        return "";
    }

    compileValueType(type: ValueType): string {
        if (type.type === ValueTypeEnum.NUM) {
            return `f64`;
        }
        if (type.type === ValueTypeEnum.BOOL) {
            return `i32`;
        }
        if (type.type === ValueTypeEnum.STRING) {
            return `String`;
        }
        throw new Error("Unknown type: " + type.type.toString());
    }

    getOperator(operator: string): string {
        if (operator === "+") {
            return "f64.add";
        }
        if (operator === "-") {
            return "f64.sub";
        }
        if (operator === "*") {
            return "f64.mul";
        }
        if (operator === "/") {
            return "f64.div";
        }
        if(operator === "%") {
            return "call $mod";
        }
        if (operator === "==") {
            return "f64.eq";
        }
        if (operator === "!=") {
            return "f64.ne";
        }
        if (operator === ">") {
            return "f64.gt";
        }
        if (operator === "<") {
            return "f64.lt";
        }
        if (operator === ">=") {
            return "f64.ge";
        }
        if (operator === "<=") {
            return "f64.le";
        }
        if (operator === "&&") {
            return "i32.and";
        }
        if (operator === "||") {
            return "i32.or";
        }

        throw new Error("Unknown operator: " + operator);
    }

    compileBool(term: Bool): string {
        if(term.value === "true") {
            return "i32.const 1";
        }
        return "i32.const 0";
    }

    private compileAbstractType(abstractType: AbstractType): string {
        if (abstractType instanceof ValueType) {
            return this.compileValueType(abstractType as ValueType);
        }

        if(abstractType instanceof StatementType){
            let statementType = abstractType as StatementType;
            if(statementType.type === StatementTypeEnum.VOID) {
                return "";
            }
        }

        throw new Error("Unknown abstract type");
    }

    private compileFunctionCallStatement(statement: FunctionCallStatement): string {
        let actualParameters = "";
        for (let i = 0; i < statement.actualParameters.length; i++) {
            let expr = this.compileAbstractExpression(statement.actualParameters[i]);
            actualParameters += `${expr}\n`;
        }
        return `${actualParameters}\ncall $${statement.functionName}`;
    }

    private compileFunctionCallExpression(expression: FunctionCallExpression): string {
        let actualParameters = "";
        for (let i = 0; i < expression.actualParameters.length; i++) {
            let expr = this.compileAbstractExpression(expression.actualParameters[i]);
            actualParameters += `${expr}\n`;
        }
        return `${actualParameters}\ncall $${expression.functionName}`;
    }

    private compileReturnStatement(statement: Return): string {
        let expr = this.compileAbstractExpression(statement.expression);
        return `${expr}\nreturn`;
    }
}

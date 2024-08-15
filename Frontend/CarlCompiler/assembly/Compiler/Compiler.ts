import {UnaryExpression} from "../AST/Nodes/Expressions/UnaryExpression";
import {BinaryExpression} from "../AST/Nodes/Expressions/BinaryExpression";
import {Identifier} from "../AST/Nodes/Expressions/Terms/Identifier";
import {Int} from "../AST/Nodes/Expressions/Terms/Int";
import {ValueType, ValueTypeEnum, ValueTypeNames} from "../AST/Nodes/Types/ValueType";
import {Declaration} from "../AST/Nodes/Statements/Declaration";
import {Program} from "../AST/Nodes/Statements/Program";
import {While} from "../AST/Nodes/Statements/While";
import {Assignment} from "../AST/Nodes/Statements/Assignment";
import {IfStatement} from "../AST/Nodes/Statements/IfStatement";
import {CompoundStatement} from "../AST/Nodes/Statements/CompoundStatement";
import {ASTString} from "../AST/Nodes/Expressions/Terms/ASTString";
import {AbstractExpression} from "../AST/Nodes/Expressions/AbstractExpression";
import {AbstractStatement} from "../AST/Nodes/Statements/AbstractStatement";
import {Bool} from "../AST/Nodes/Expressions/Terms/Bool";
import {FunctionDeclaration} from "../AST/Nodes/Statements/FunctionDeclaration";
import {AbstractType} from "../AST/Nodes/Types/AbstractType";
import {StatementType, StatementTypeEnum} from "../AST/Nodes/Types/StatementType";
import {FunctionCallStatement} from "../AST/Nodes/Statements/FunctionCallStatement";
import {FunctionCallExpression} from "../AST/Nodes/Expressions/FunctionCallExpression";
import {Return} from "../AST/Nodes/Statements/Return";
import {VarEnv} from "../Env/VarEnv";
import {ImportFunction} from "../AST/Nodes/Statements/ImportFunction";
import {Double} from "../AST/Nodes/Expressions/Terms/Double";
import {FunctionCallInterface} from "../AST/Nodes/FunctionCallInterface";

export class Compiler {
    wasmCode: string[] = [];
    globalDeclarations: string[] = [];
    functionDeclarations: string[] = [];
    imports: string[] = [];
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

        if (statement instanceof ImportFunction) {
            return this.compileImport(statement as ImportFunction);
        }

        if (statement instanceof FunctionDeclaration) {
            return this.compileFunctionDeclaration(statement as FunctionDeclaration);
        }

        if(statement instanceof FunctionCallStatement){
            return this.compileFunctionCall(statement as FunctionCallStatement);
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
        if(VarEnv.globalVars.has(statement.identifier.value)) {
            return `${expr}\nglobal.set $${statement.identifier.value}`;
        }
        return `${expr}\nlocal.set $${statement.identifier.value}`;
    }

    compileWhile(statement: While): string {
        let start: i32 = this.funcCount;
        this.funcCount++;
        let initiator: string = "";
        if(statement.initiator !== null) {
            initiator = this.compileAbstractStatement(statement.initiator!);
        }
        let condition = this.compileAbstractExpression(statement.condition);

        let body: string = this.compileAbstractStatement(statement.body!);

        return`${initiator}` + `\n` +
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

    compileImport(statement: ImportFunction): string {
        let parameters = "(param ";
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            let type = this.compileAbstractType(statement.parameters.get(key));
            parameters += `${type} `;
        }
        parameters += ")";
        let returnType = '(result ' + this.compileAbstractType(statement.returnType) + ')';
        let $import = `(import "${statement.parentPath}" "${statement.childPath}" (func $${statement.name.value} ${parameters} ${returnType}))`;
        this.imports.push($import);
        return "";
    }

    compileProgram(statement: Program): string {
        if(statement.body !== null) {
            this.compileAbstractStatement(statement.body!);
        }
        return '(module\n' +
            this.imports.join("\n") + '\n' +
            '(import "js" "memory" (memory 1))\n' +
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

        if (expression instanceof Int) {
            return this.compileInt(expression as Int);
        }

        if (expression instanceof Double) {
            return this.compileDouble(expression as Double);
        }

        if (expression instanceof ASTString) {
            return this.compileString(expression as ASTString);
        }

        if(expression instanceof FunctionCallExpression) {
            return this.compileFunctionCall(expression as FunctionCallExpression);
        }

        throw new Error("Unknown abstract expression type");
    }

    compileUnaryExpression(expression: UnaryExpression): string {
        let right = this.compileAbstractExpression(expression.primaryOrRight);
        if (expression.operator === "-") {
            right = `${right}\nf64.neg`;
        }

        if (expression.operator === "!") {
            right = `${right}\ni32.eqz`;
        }

        if(expression.type!.type === ValueTypeEnum.STRING && expression.primaryOrRight.type!.type === ValueTypeEnum.DOUBLE) {
            right = `${right}\ncall $toStringDouble`;
        }

        if(expression.type!.type === ValueTypeEnum.STRING && expression.primaryOrRight.type!.type === ValueTypeEnum.INT) {
            right = `${right}\ncall $toStringInt`;
        }

        return `${right}\n`;
    }

    compileBinaryExpression(expression: BinaryExpression): string {
        let rightValueType: ValueType | null = expression.right.type;
        let leftValueType: ValueType | null = expression.primaryOrLeft.type;

        if(rightValueType === null) {
            throw new Error("Right value type is null: " + expression.right.toString() + " on line: " + expression.lineNum.toString());
        }
        if(leftValueType === null) {
            throw new Error("Left value type is null: " + expression.primaryOrLeft.toString() + " on line: " + expression.lineNum.toString());
        }

        let rightType: ValueTypeEnum = rightValueType.type;
        let leftType: ValueTypeEnum = leftValueType.type;

        if(leftType === ValueTypeEnum.STRING && rightType === ValueTypeEnum.STRING) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\n${right}\ncall $concat`;
        }

        if(leftType === ValueTypeEnum.STRING && rightType === ValueTypeEnum.DOUBLE) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\n${right}\ncall $toStringDouble\ncall $concat`;
        }

        if(leftType === ValueTypeEnum.STRING && rightType === ValueTypeEnum.INT) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\n${right}\ncall $toStringInt\ncall $concat`;
        }

        if(leftType === ValueTypeEnum.DOUBLE && rightType === ValueTypeEnum.STRING) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\ncall $toStringDouble\n${right}\ncall $concat`;
        }

        if(leftType === ValueTypeEnum.INT && rightType === ValueTypeEnum.STRING) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\ncall $toStringInt\n${right}\ncall $concat`;
        }

        if(leftType === ValueTypeEnum.INT && rightType === ValueTypeEnum.DOUBLE) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\nf64.convert_i32_s\n${right}\n${this.getOperator(expression.operator, expression.type!.type)}`;
        }

        if(leftType === ValueTypeEnum.DOUBLE && rightType === ValueTypeEnum.INT) {
            let left = this.compileAbstractExpression(expression.primaryOrLeft);
            let right = this.compileAbstractExpression(expression.right);
            return `${left}\n${right}\nf64.convert_i32_s\n${this.getOperator(expression.operator, expression.type!.type)}`;
        }

        let left = this.compileAbstractExpression(expression.primaryOrLeft);
        let right = this.compileAbstractExpression(expression.right);
        return `${left}\n${right}\n${this.getOperator(expression.operator, expression.type!.type)}`;
    }

    compileIdentifier(term: Identifier): string {
        if(VarEnv.globalVars.has(term.value)) {
            return `global.get $${term.value}`;
        }
        return `local.get $${term.value}`;
    }

    compileInt(term: Int): string {
        return `i32.const ${term.value}`;
    }

    compileDouble(term: Double): string {
        return `f64.const ${term.value}`;
    }

    compileDeclaration(statement: Declaration): string {
        let string = "";
        if (statement.expression !== null) {
            let expr = this.compileAbstractExpression(statement.expression!);
            if(statement.global) {
                string += `\n${expr}\nglobal.set $${statement.identifier.value}`;
                this.globalDeclarations.push(`(global $${statement.identifier.value} (export "${statement.identifier.value}") (mut ${this.compileValueType(statement.type)}) (${expr}))`);
            }else {
                string += `\n${expr}\nlocal.set $${statement.identifier.value}`;
            }
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
            params += `(param $${key} ${this.compileAbstractType(type)})\n`;
        }
        let functionIdentifier =  statement.export ? `$${statement.name.value} (export "${statement.name.value}")` : `$${statement.name.value}`;
        let returnType = this.compileAbstractType(statement.returnType);
        let $functionNameAndParameters = `(func ${functionIdentifier} ${params} (result ${returnType})`;
        let $function = `${$functionNameAndParameters}\n` +
            `${body}\n` +
            `)`;
        this.functionDeclarations.push($function);
        return "";
    }

    compileValueType(type: ValueType): string {
        if (type.type === ValueTypeEnum.DOUBLE) {
            return `f64`;
        }
        if (type.type === ValueTypeEnum.INT) {
            return `i32`;
        }
        if (type.type === ValueTypeEnum.BOOL) {
            return `i32`;
        }
        if (type.type === ValueTypeEnum.STRING) {
            return `i32`;
        }
        throw new Error("Unknown type: " + type.type.toString());
    }

    getOperator(operator: string, type: ValueTypeEnum): string {
        if (operator === "+") {
            if(type === ValueTypeEnum.DOUBLE) {
                return "f64.add";
            }else if (type === ValueTypeEnum.INT) {
                return "i32.add";
            }
        }
        if (operator === "-") {
            if (type === ValueTypeEnum.DOUBLE) {
                return "f64.sub";
            } else if (type === ValueTypeEnum.INT) {
                return "i32.sub";
            }
        }
        if (operator === "*") {
            if (type === ValueTypeEnum.DOUBLE) {
                return "f64.mul";
            } else if (type === ValueTypeEnum.INT) {
                return "i32.mul";
            }
        }
        if (operator === "/") {
            if (type === ValueTypeEnum.DOUBLE) {
                return "f64.div";
            } else if (type === ValueTypeEnum.INT) {
                return "i32.div_s";
            }
        }
        if(operator === "%") {
            if(type === ValueTypeEnum.DOUBLE) {
                return "call $mod";
            } else if(type === ValueTypeEnum.INT) {
                return "i32.rem_s";
            }
        }
        if ( operator === "==") {
            if(type === ValueTypeEnum.DOUBLE) {
                return "f64.eq";
            } else if(type === ValueTypeEnum.INT) {
                return "i32.eq";
            }
        }
        if (operator === "!=") {
            if(type === ValueTypeEnum.DOUBLE) {
                return "f64.ne";
            } else if(type === ValueTypeEnum.INT) {
                return "i32.ne";
            }
        }
        if (operator === ">") {
            if (type === ValueTypeEnum.DOUBLE) {
                return "f64.gt";
            } else if(type === ValueTypeEnum.INT) {
                return "i32.gt_s";
            }
        }
        if (operator === "<") {
            if (type === ValueTypeEnum.DOUBLE) {
                return "f64.lt";
            } else if(type === ValueTypeEnum.INT) {
                return "i32.lt_s";
            }
        }
        if (operator === ">=") {
            if (type === ValueTypeEnum.DOUBLE) {
                return "f64.ge";
            } else if(type === ValueTypeEnum.INT) {
                return "i32.ge_s";
            }
        }
        if (operator === "<=") {
            if (type === ValueTypeEnum.DOUBLE) {
                return "f64.le";
            } else if(type === ValueTypeEnum.INT) {
                return "i32.le_s";
            }
        }
        if (operator === "==") {
            if(type === ValueTypeEnum.BOOL) {
                return "i32.eq";
            }else if(type === ValueTypeEnum.INT) {
                return "i32.eq";
            }else if(type === ValueTypeEnum.DOUBLE) {
                return "f64.eq";
            }else if(type === ValueTypeEnum.STRING) {
                return "i32.eq";
            }
        }
        if (operator === "&&") {
            return "i32.and";
        }
        if (operator === "||") {
            return "i32.or";
        }

        throw new Error("Unknown operator: " + operator + " for type: " + ValueTypeNames[type]);
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

    compileFunctionCall(functionCall: FunctionCallInterface): string {
        let actualParameters = "";
        for (let i = 0; i < functionCall.actualParameters.length; i++) {
            let expr = this.compileAbstractExpression(functionCall.actualParameters[i]);
            actualParameters += `${expr}\n`;

            let expectedType = functionCall.expectedParameters !== null ? functionCall.expectedParameters![i] as ValueType : null;

            if (expectedType == null) {
                return `${actualParameters}\ncall $${functionCall.functionName}`;
            }

            // Handle conversion from DOUBLE (f64) to INT (i32)
            if (functionCall.actualParameters[i].type!.type === ValueTypeEnum.DOUBLE && expectedType.type === ValueTypeEnum.INT) {
                actualParameters += `f64.convert_i32_s\n`;
            }
            // Handle conversion from INT (i32) to DOUBLE (f64)
            if (functionCall.actualParameters[i].type!.type === ValueTypeEnum.INT && expectedType.type === ValueTypeEnum.DOUBLE) {
                actualParameters += `i32.trunc_f64_s\n`;
            }
            // Handle conversion from INT (i32) to STRING
            if (functionCall.actualParameters[i].type!.type === ValueTypeEnum.INT && expectedType.type === ValueTypeEnum.STRING) {
                actualParameters += `call $toStringInt\n`;
            }
            // Handle conversion from DOUBLE (f64) to STRING
            if (functionCall.actualParameters[i].type!.type === ValueTypeEnum.DOUBLE && expectedType.type === ValueTypeEnum.STRING) {
                actualParameters += `call $toStringDouble\n`;
            }
            // Handle conversion from BOOL (i32) to STRING
            if(functionCall.actualParameters[i].type!.type === ValueTypeEnum.BOOL && expectedType.type === ValueTypeEnum.STRING) {
                actualParameters += `call $toStringBool\n`;
            }
        }
        return `${actualParameters}\ncall $${functionCall.functionName}`;
    }


    private compileReturnStatement(statement: Return): string {
        let expr = this.compileAbstractExpression(statement.expression);
        return `${expr}\nreturn`;
    }
}

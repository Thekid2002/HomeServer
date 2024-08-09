import {BinaryExpression} from "../AST/Nodes/Expressions/BinaryExpression";
import {Identifier} from "../AST/Nodes/Expressions/Terms/Identifier";
import {Num} from "../AST/Nodes/Expressions/Terms/Num";
import {Term} from "../AST/Nodes/Expressions/Terms/Term";
import {UnaryExpression} from "../AST/Nodes/Expressions/UnaryExpression";
import {Assignment} from "../AST/Nodes/Statements/Assignment";
import {Declaration} from "../AST/Nodes/Statements/Declaration";
import {Print} from "../AST/Nodes/Statements/Print";
import {Program} from "../AST/Nodes/Statements/Program";
import {While} from "../AST/Nodes/Statements/While";
import {ValueType, ValueTypeEnum, ValueTypeNames} from "../AST/Nodes/Types/ValueType";
import {AbstractType} from "../AST/Nodes/Types/AbstractType";
import {StatementType, StatementTypeEnum, StatementTypeNames} from "../AST/Nodes/Types/StatementType";
import {FuncEnv} from "../Env/FuncEnv";
import {VarEnv} from "../Env/VarEnv";
import {IfStatement} from "../AST/Nodes/Statements/IfStatement";
import {CompoundStatement} from "../AST/Nodes/Statements/CompoundStatement";
import {ASTString} from "../AST/Nodes/Expressions/Terms/ASTString";
import { Scan } from "../AST/Nodes/Statements/Scan";
import { Bool } from "../AST/Nodes/Expressions/Terms/Bool";
import { FunctionDeclaration } from "../AST/Nodes/Statements/FunctionDeclaration";
import {AbstractStatement} from "../AST/Nodes/Statements/AbstractStatement";
import {AbstractExpression} from "../AST/Nodes/Expressions/AbstractExpression";
import {FunctionCallStatement} from "../AST/Nodes/Statements/FunctionCallStatement";
import {FunctionCallExpression} from "../AST/Nodes/Expressions/FunctionCallExpression";
import {Return} from "../AST/Nodes/Statements/Return";

export class CombinedChecker {
    public errors: string[] = [];

    checkProgram(statement: Program, varEnv: VarEnv, funcEnv: FuncEnv): StatementType {
        if(statement.body !== null) {
            this.checkStatement(statement.body!, varEnv, funcEnv);
        }
        statement.varEnv = varEnv;
        return new StatementType(StatementTypeEnum.PROGRAM, statement.lineNum);
    }

    checkStatement(statement: AbstractStatement, varEnv: VarEnv, funcEnv: FuncEnv): StatementType {
        if(statement instanceof Declaration) {
            return this.checkDeclaration(statement as Declaration, varEnv, funcEnv);
        }

        if(statement instanceof Assignment) {
            return this.checkAssignment(statement as Assignment, varEnv, funcEnv);
        }

        if(statement instanceof Print) {
            return this.checkPrint(statement as Print, varEnv, funcEnv);
        }

        if(statement instanceof While) {
            return this.checkWhile(statement as While, varEnv, funcEnv);
        }

        if(statement instanceof IfStatement) {
            return this.checkIfStatement(statement as IfStatement, varEnv, funcEnv);
        }

        if(statement instanceof CompoundStatement) {
            return this.checkCompoundStatement(statement as CompoundStatement, varEnv, funcEnv);
        }

        if(statement instanceof FunctionDeclaration) {
            return this.checkFunctionDeclaration(statement as FunctionDeclaration, varEnv, funcEnv);
        }

        if(statement instanceof Scan) {
            return this.checkScan(statement as Scan, varEnv, funcEnv);
        }

        if(statement instanceof FunctionCallStatement){
            return this.checkFunctionCallStatement(statement as FunctionCallStatement, varEnv, funcEnv);
        }

        if(statement instanceof Return){
            return new StatementType(StatementTypeEnum.RETURN, statement.lineNum);
        }

        this.errors.push("Line: " + statement.lineNum.toString() + " Statement not supported");
        return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
    }

    checkCompoundStatement(statement: CompoundStatement, varEnv: VarEnv, funcEnv: FuncEnv): StatementType {
        let left = this.checkStatement(statement.left, varEnv, funcEnv);
        let right =this.checkStatement(statement.right, varEnv, funcEnv);
        return left;
    }

    checkExpression(expression: AbstractExpression, varEnv: VarEnv, funcEnv: FuncEnv): AbstractType | null {
        if(expression instanceof BinaryExpression) {
            return this.checkBinaryExpression(expression as BinaryExpression, varEnv, funcEnv);
        }

        if(expression instanceof UnaryExpression) {
            return this.checkUnaryExpression(expression as UnaryExpression, varEnv, funcEnv);
        }

        if(expression instanceof Term) {
            return this.checkTerm(expression as Term, varEnv, funcEnv);
        }

        if(expression instanceof Num) {
            return this.checkNumber(expression as Num, varEnv, funcEnv);
        }

        if(expression instanceof Bool) {
            return this.checkBool(expression as Bool, varEnv, funcEnv);
        }

        if(expression instanceof ASTString) {
            return this.checkString(expression as ASTString, varEnv, funcEnv);
        }

        if(expression instanceof Identifier) {
            return this.checkIdentifier(expression as Identifier, varEnv, funcEnv);
        }

        if(expression instanceof FunctionCallExpression) {
            return this.checkFunctionCallExpression(expression as FunctionCallExpression, varEnv, funcEnv);
        }

        this.errors.push("Line: " + expression.lineNum.toString() + " Expression not supported");
        return new ValueType(ValueTypeEnum.Error, expression.lineNum);
    }



    checkBinaryExpression(expression: BinaryExpression, varEnv: VarEnv, funcEnv: FuncEnv): ValueType {
        let left = this.checkExpression(expression.primaryOrLeft, varEnv, funcEnv) as ValueType;
        let right = this.checkExpression(expression.right, varEnv, funcEnv) as ValueType;

        if(expression.operator === "+") {
            if((left.type === ValueTypeEnum.STRING && (right.type === ValueTypeEnum.STRING || right.type === ValueTypeEnum.NUM || right.type === ValueTypeEnum.BOOL))
                || right.type === ValueTypeEnum.STRING && (left.type === ValueTypeEnum.STRING || left.type === ValueTypeEnum.NUM || left.type === ValueTypeEnum.BOOL)) {
                expression.type = ValueTypeEnum.STRING;
                return new ValueType(ValueTypeEnum.STRING, expression.lineNum);
            }
            if(left.type === ValueTypeEnum.NUM && right.type === ValueTypeEnum.NUM) {
                expression.type = ValueTypeEnum.NUM;
                return new ValueType(ValueTypeEnum.NUM, expression.lineNum);
            }

            this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.NUM] + " or " + ValueTypeNames[ValueTypeEnum.STRING] + " but got: " + ValueTypeNames[left.type]);
            return new ValueType(ValueTypeEnum.Error, expression.lineNum);
        }

        if(expression.operator === "-" || expression.operator === "*" || expression.operator === "/" || expression.operator === "%") {
            if(left.type !== ValueTypeEnum.NUM || right.type !== ValueTypeEnum.NUM) {
                this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.NUM] + " but got: " + ValueTypeNames[left.type]);
            }
            expression.type = ValueTypeEnum.NUM;
            return new ValueType(ValueTypeEnum.NUM, expression.lineNum);
        }

        if(expression.operator === "==" || expression.operator === "!=") {
            if(left.type !== right.type) {
                this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[left.type] + " but got: " + ValueTypeNames[right.type]);
            }
            expression.type = ValueTypeEnum.BOOL;
            return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
        }

        if(expression.operator === ">" || expression.operator === "<" || expression.operator === ">=" || expression.operator === "<=") {
            if(left.type !== ValueTypeEnum.NUM || right.type !== ValueTypeEnum.NUM) {
                this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.NUM] + " but got: " + ValueTypeNames[left.type]);
            }
            expression.type = ValueTypeEnum.BOOL;
            return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
        }

        if(expression.operator === "&&" || expression.operator === "||") {
            if(left.type !== ValueTypeEnum.BOOL || right.type !== ValueTypeEnum.BOOL) {
                this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[left.type]);
            }
            expression.type = ValueTypeEnum.BOOL;
            return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
        }

        this.errors.push("Line: " + expression.lineNum.toString() + " Operator " + expression.operator + " not supported");
        return left;
    }

    checkFunctionDeclaration(statement: FunctionDeclaration, varEnv: VarEnv, funcEnv: FuncEnv): StatementType {
        let type = funcEnv.lookUp(statement.name.value);
        if (type !== null) {
            this.errors.push("FunctionObject " + statement.name.value + " already declared in Line: " + statement.lineNum.toString());
        }
        varEnv = varEnv.enterScope();
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            let type = statement.parameters.get(key);

            varEnv.addVar(key, type);
        }
        this.checkStatement(statement.body, varEnv, funcEnv);
        statement.varEnv = varEnv;
        funcEnv.addFunc(statement.name.value, statement.returnType, statement.parameters, varEnv);
        return new StatementType(StatementTypeEnum.FUNCTION_DECLARATION, statement.lineNum);
    }

    checkUnaryExpression(expression: UnaryExpression, varEnv: VarEnv, funcEnv: FuncEnv): ValueType | null {
        let typeOfExpression = this.checkExpression(expression.primaryOrRight, varEnv, funcEnv);
        if(typeOfExpression === null || !(typeOfExpression instanceof ValueType)) {
            this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.NUM] + " or " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[ValueTypeEnum.Error]);
            return null;
        }

        let type = typeOfExpression as ValueType;
        if(expression.operator === "!") {
            if(type.type !== ValueTypeEnum.BOOL) {
                this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[type.type]);
            }
            expression.type = ValueTypeEnum.BOOL;
            return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
        }
        if(expression.operator === "-") {
            if(type.type !== ValueTypeEnum.NUM) {
                this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.NUM] + " but got: " + ValueTypeNames[type.type]);
            }
            expression.type = ValueTypeEnum.NUM;
            return new ValueType(ValueTypeEnum.NUM, expression.lineNum);
        }
        this.errors.push("Line: " + expression.lineNum.toString() + " Operator " + expression.operator + " not supported");
        return type;
    }

    checkTerm(term: Term, varEnv: VarEnv, funcEnv: FuncEnv): ValueType {
        throw new Error("Method not implemented.");
    }

    checkNumber(term: Num, varEnv: VarEnv, funcEnv: FuncEnv): ValueType {
        term.type = ValueTypeEnum.NUM;
        return new ValueType(ValueTypeEnum.NUM, term.lineNum);
    }

    checkBool(term: Bool, varEnv: VarEnv, funcEnv: FuncEnv): AbstractType | null {
        term.type = ValueTypeEnum.BOOL;
        return new ValueType(ValueTypeEnum.BOOL, term.lineNum);
    }

    checkString(param: ASTString, varEnv: VarEnv, funcEnv: FuncEnv): AbstractType | null {
        param.type = ValueTypeEnum.STRING;
        return new ValueType(ValueTypeEnum.STRING, param.lineNum);
    }

    checkIdentifier(term: Identifier, varEnv: VarEnv, funcEnv: FuncEnv): ValueType {
        let type = varEnv.lookUpType(term.value) as ValueType | null;
        if (type === null) {
            this.errors.push("0_Variable " + term.value + " not declared in Line: " + term.lineNum.toString());
            return new ValueType(ValueTypeEnum.Error, term.lineNum);
        }
        term.type = type.type;
        return type as ValueType;
    }

    checkDeclaration(statement: Declaration, varEnv: VarEnv, funcEnv: FuncEnv): StatementType {
        let exprType: ValueType | null = null;
        if(statement.expression !== null) {
            exprType = this.checkExpression(statement.expression!, varEnv, funcEnv) as ValueType;
        }
        if(exprType !== null && exprType.type !== statement.type.type) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[statement.type.type] + " but got: " + ValueTypeNames[exprType.type]);
        }
        if(statement.global){
            varEnv.addGlobalVar(statement.identifier.value, statement.type);
        }else {
            varEnv.addVar(statement.identifier.value, statement.type);
        }
        return new StatementType(StatementTypeEnum.VAR_DECL, statement.lineNum);
    }

    checkPrint(statement: Print, varEnv: VarEnv, funcEnv: FuncEnv): StatementType {
        if(statement.expression !== null) {
            let type = this.checkExpression(statement.expression, varEnv, funcEnv);
            if(type === null) {
                this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.NUM] + " or " + ValueTypeNames[ValueTypeEnum.STRING] + " but got: " + ValueTypeNames[ValueTypeEnum.Error]);
            }

            let valueType = type as ValueType;
            if(valueType.type !== ValueTypeEnum.NUM && valueType.type !== ValueTypeEnum.STRING && valueType.type !== ValueTypeEnum.BOOL) {
                this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.NUM] + " or " + ValueTypeNames[ValueTypeEnum.STRING] + " or " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[valueType.type]);
            }
        }
        return new StatementType(StatementTypeEnum.PRINT, statement.lineNum);
    }

    checkWhile(statement: While, varEnv: VarEnv, funcEnv: FuncEnv): StatementType {
        let initType: StatementType | null = null;
        if(statement.initiator !== null) {
            initType = this.checkStatement(statement.initiator!, varEnv, funcEnv);
        }
        if(initType !== null && initType.type !== StatementTypeEnum.VAR_DECL && initType.type !== StatementTypeEnum.ASSIGNMENT) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + StatementTypeNames[StatementTypeEnum.VAR_DECL] + " or " + StatementTypeNames[StatementTypeEnum.ASSIGNMENT] + " but got: " + StatementTypeNames[initType.type]);
        }
        let condType = this.checkExpression(statement.condition, varEnv, funcEnv);
        if(condType === null) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[ValueTypeEnum.Error]);
        }
        let condTypeValue = condType as ValueType;
        if(statement.body !== null) {
            this.checkStatement(statement.body!, varEnv, funcEnv);
        }
        if (condTypeValue.type !== ValueTypeEnum.BOOL) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[condTypeValue.type]);
        }

        return new StatementType(StatementTypeEnum.WHILE, statement.lineNum);
    }

    checkAssignment(statement: Assignment, varEnv: VarEnv, funcEnv: FuncEnv): StatementType {
        let exprType = this.checkExpression(statement.expression, varEnv, funcEnv) as ValueType;
        let identifierType = varEnv.lookUpType(statement.identifier.value) as ValueType | null;
        if(identifierType === null) {
            this.errors.push("1_Variable " + statement.identifier.value + " not declared in Line: " + statement.lineNum.toString());
            return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
        }
        if (exprType.type !== identifierType.type) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[identifierType.type] + " but got: " + ValueTypeNames[exprType.type]);
            return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
        }

        return new StatementType(StatementTypeEnum.ASSIGNMENT, statement.lineNum);
    }

    checkIfStatement(statement: IfStatement, varEnv: VarEnv, funcEnv: FuncEnv): StatementType {
        let condType = this.checkExpression(statement.condition, varEnv, funcEnv) as ValueType;
        if (condType.type !== ValueTypeEnum.BOOL) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[condType.type]);
        }
        if (statement.body !== null) {
            this.checkStatement(statement.body!, varEnv, funcEnv);
        }
        if (statement.else !== null) {
            this.checkStatement(statement.else!, varEnv, funcEnv);
        }
        return new StatementType(StatementTypeEnum.IF, statement.lineNum);
    }

    checkScan(statement: Scan, varEnv: VarEnv, funcEnv: FuncEnv): StatementType {
        let type = varEnv.lookUpType(statement.identifier.value) as ValueType | null;
        if (type === null) {
            this.errors.push("2_Variable " + statement.identifier.value + " not declared in Line: " + statement.lineNum.toString());
            return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
        }
        if(type.type !== statement.type.type) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[type.type] + " but got: " + ValueTypeNames[statement.type.type]);
        }
        return new StatementType(StatementTypeEnum.SCAN, statement.lineNum);
    }

    private checkFunctionCallStatement(statement: FunctionCallStatement, varEnv: VarEnv, funcEnv: FuncEnv): StatementType {
        let func = funcEnv.lookUp(statement.functionName);
        if (func === null) {
            this.errors.push("Function " + statement.functionName + " not declared in Line: " + statement.lineNum.toString());
            return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
        }
        if (func.parameters.keys().length !== statement.actualParameters.length) {
            this.errors.push("Function " + statement.functionName + " expected " + func.parameters.keys().length.toString() + " parameters but got " + statement.actualParameters.length.toString() + " in Line: " + statement.lineNum.toString());
            return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
        }
        for (let i = 0; i < statement.actualParameters.length; i++) {
            let paramType = this.checkExpression(statement.actualParameters[i], varEnv, funcEnv) as ValueType;
            let expectedType = func.parameters.get(func.parameters.keys()[i]) as ValueType;
            if (paramType.type !== expectedType.type) {
                this.errors.push("Function " + statement.functionName + " expected parameter " + i.toString() + " to be of type " + ValueTypeNames[expectedType.type] + " but got " + ValueTypeNames[paramType.type] + " in Line: " + statement.lineNum.toString());
                return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
            }
        }
        return new StatementType(StatementTypeEnum.FUNCTION_CALL, statement.lineNum);
    }

    private checkFunctionCallExpression(expression: FunctionCallExpression, varEnv: VarEnv, funcEnv: FuncEnv): ValueType {
        let func = funcEnv.lookUp(expression.functionName);
        if (func === null) {
            this.errors.push("Function " + expression.functionName + " not declared in Line: " + expression.lineNum.toString());
            return new ValueType(ValueTypeEnum.Error, expression.lineNum);
        }
        if (func.parameters.keys().length !== expression.actualParameters.length) {
            this.errors.push("Function " + expression.functionName + " expected " + func.parameters.keys().length.toString() + " parameters but got " + expression.actualParameters.length.toString() + " in Line: " + expression.lineNum.toString());
            return new ValueType(ValueTypeEnum.Error, expression.lineNum);
        }
        for (let i = 0; i < expression.actualParameters.length; i++) {
            let paramType = this.checkExpression(expression.actualParameters[i], varEnv, funcEnv) as ValueType;
            let expectedType = func.parameters.get(func.parameters.keys()[i]) as ValueType;
            if (paramType.type !== expectedType.type) {
                this.errors.push("Function " + expression.functionName + " expected parameter " + i.toString() + " to be of type " + ValueTypeNames[expectedType.type] + " but got " + ValueTypeNames[paramType.type] + " in Line: " + expression.lineNum.toString());
                return new ValueType(ValueTypeEnum.Error, expression.lineNum);
            }
        }
        return func.returnType as ValueType;
    }
}

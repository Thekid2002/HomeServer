import { BinaryExpression } from "../AST/Nodes/Expressions/BinaryExpression";
import { Identifier } from "../AST/Nodes/Expressions/Terms/Identifier";
import { Int } from "../AST/Nodes/Expressions/Terms/Int";
import { UnaryExpression } from "../AST/Nodes/Expressions/UnaryExpression";
import { Assignment } from "../AST/Nodes/Statements/Assignment";
import { Declaration } from "../AST/Nodes/Statements/Declaration";
import { Program } from "../AST/Nodes/Statements/Program";
import { While } from "../AST/Nodes/Statements/While";
import {
    ValueType,
    ValueTypeEnum,
    ValueTypeNames
} from "../AST/Nodes/Types/ValueType";
import { AbstractType } from "../AST/Nodes/Types/AbstractType";
import {
    StatementType,
    StatementTypeEnum,
    StatementTypeNames
} from "../AST/Nodes/Types/StatementType";
import { FuncEnv } from "../Env/FuncEnv";
import { VarEnv } from "../Env/VarEnv";
import { IfStatement } from "../AST/Nodes/Statements/IfStatement";
import { CompoundStatement } from "../AST/Nodes/Statements/CompoundStatement";
import { ASTString } from "../AST/Nodes/Expressions/Terms/ASTString";
import { Bool } from "../AST/Nodes/Expressions/Terms/Bool";
import { FunctionDeclaration } from "../AST/Nodes/Statements/FunctionDeclaration";
import { AbstractStatement } from "../AST/Nodes/Statements/AbstractStatement";
import { AbstractExpression } from "../AST/Nodes/Expressions/AbstractExpression";
import { FunctionCallStatement } from "../AST/Nodes/Statements/FunctionCallStatement";
import { FunctionCallExpression } from "../AST/Nodes/Expressions/FunctionCallExpression";
import { Return } from "../AST/Nodes/Statements/Return";
import { ImportFunction } from "../AST/Nodes/Statements/ImportFunction";
import { Double } from "../AST/Nodes/Expressions/Terms/Double";

export class CombinedChecker {
    public errors: string[] = [];

    checkProgram(
        statement: Program,
        varEnv: VarEnv,
        funcEnv: FuncEnv,
        currentReturnType: ValueType | null = null
    ): StatementType {
        if (statement.body !== null) {
            this.checkStatement(statement.body!, varEnv, funcEnv, currentReturnType);
        }
        statement.varEnv = varEnv;
        return new StatementType(StatementTypeEnum.PROGRAM, statement.lineNum);
    }

    checkStatement(
        statement: AbstractStatement,
        varEnv: VarEnv,
        funcEnv: FuncEnv,
        currentReturnType: ValueType | null
    ): StatementType {
        if (statement instanceof Declaration) {
            return this.checkDeclaration(statement as Declaration, varEnv, funcEnv);
        }

        if (statement instanceof Assignment) {
            return this.checkAssignment(statement as Assignment, varEnv, funcEnv);
        }

        if (statement instanceof While) {
            return this.checkWhile(
        statement as While,
        varEnv,
        funcEnv,
        currentReturnType
            );
        }

        if (statement instanceof ImportFunction) {
            return this.checkImport(statement as ImportFunction, varEnv, funcEnv);
        }

        if (statement instanceof IfStatement) {
            return this.checkIfStatement(
        statement as IfStatement,
        varEnv,
        funcEnv,
        currentReturnType
            );
        }

        if (statement instanceof CompoundStatement) {
            return this.checkCompoundStatement(
        statement as CompoundStatement,
        varEnv,
        funcEnv,
        currentReturnType
            );
        }

        if (statement instanceof FunctionDeclaration) {
            return this.checkFunctionDeclaration(
        statement as FunctionDeclaration,
        varEnv,
        funcEnv
            );
        }

        if (statement instanceof FunctionCallStatement) {
            return this.checkFunctionCallStatement(
        statement as FunctionCallStatement,
        varEnv,
        funcEnv
            );
        }

        if (statement instanceof Return) {
            return this.checkReturnStatement(
        statement as Return,
        varEnv,
        funcEnv,
        currentReturnType
            );
        }

        this.errors.push(
            "Line: " + statement.lineNum.toString() + " Statement not supported"
        );
        return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
    }

    checkCompoundStatement(
        statement: CompoundStatement,
        varEnv: VarEnv,
        funcEnv: FuncEnv,
        currentReturnType: ValueType | null
    ): StatementType {
        const left = this.checkStatement(
            statement.left,
            varEnv,
            funcEnv,
            currentReturnType
        );
        const right = this.checkStatement(
            statement.right,
            varEnv,
            funcEnv,
            currentReturnType
        );
        return left;
    }

    checkExpression(
        expression: AbstractExpression,
        varEnv: VarEnv,
        funcEnv: FuncEnv
    ): AbstractType | null {
        if (expression instanceof BinaryExpression) {
            return this.checkBinaryExpression(
        expression as BinaryExpression,
        varEnv,
        funcEnv
            );
        }

        if (expression instanceof UnaryExpression) {
            return this.checkUnaryExpression(
        expression as UnaryExpression,
        varEnv,
        funcEnv
            );
        }

        if (expression instanceof Double) {
            return this.checkDouble(expression as Double, varEnv, funcEnv);
        }

        if (expression instanceof Int) {
            return this.checkInt(expression as Int, varEnv, funcEnv);
        }

        if (expression instanceof Bool) {
            return this.checkBool(expression as Bool, varEnv, funcEnv);
        }

        if (expression instanceof ASTString) {
            return this.checkString(expression as ASTString, varEnv, funcEnv);
        }

        if (expression instanceof Identifier) {
            return this.checkIdentifier(expression as Identifier, varEnv, funcEnv);
        }

        if (expression instanceof FunctionCallExpression) {
            return this.checkFunctionCallExpression(
        expression as FunctionCallExpression,
        varEnv,
        funcEnv
            );
        }

        this.errors.push(
            "Line: " + expression.lineNum.toString() + " Expression not supported"
        );
        return new ValueType(ValueTypeEnum.Error, expression.lineNum);
    }

    checkBinaryExpression(
        expression: BinaryExpression,
        varEnv: VarEnv,
        funcEnv: FuncEnv
    ): ValueType {
        const left = this.checkExpression(
            expression.primaryOrLeft,
            varEnv,
            funcEnv
        ) as ValueType;
        const right = this.checkExpression(
            expression.right,
            varEnv,
            funcEnv
        ) as ValueType;

        if (expression.operator === "+") {
            if (
                (left.type === ValueTypeEnum.STRING &&
          (right.type === ValueTypeEnum.STRING ||
            right.type === ValueTypeEnum.DOUBLE ||
            right.type === ValueTypeEnum.BOOL ||
            right.type === ValueTypeEnum.INT)) ||
        (right.type === ValueTypeEnum.STRING &&
          (left.type === ValueTypeEnum.STRING ||
            left.type === ValueTypeEnum.DOUBLE ||
            left.type === ValueTypeEnum.BOOL ||
            left.type === ValueTypeEnum.INT))
            ) {
                expression.type = new ValueType(
                    ValueTypeEnum.STRING,
                    expression.lineNum
                );
                return new ValueType(ValueTypeEnum.STRING, expression.lineNum);
            }
            if (
                (left.type === ValueTypeEnum.DOUBLE &&
          right.type === ValueTypeEnum.DOUBLE) ||
        (right.type === ValueTypeEnum.DOUBLE &&
          left.type === ValueTypeEnum.INT) ||
        (right.type === ValueTypeEnum.INT && left.type === ValueTypeEnum.DOUBLE)
            ) {
                expression.type = new ValueType(
                    ValueTypeEnum.DOUBLE,
                    expression.lineNum
                );
                return new ValueType(ValueTypeEnum.DOUBLE, expression.lineNum);
            }
            if (left.type === ValueTypeEnum.INT && right.type === ValueTypeEnum.INT) {
                expression.type = new ValueType(ValueTypeEnum.INT, expression.lineNum);
                return new ValueType(ValueTypeEnum.INT, expression.lineNum);
            }

            this.errors.push(
                "Line: " +
          expression.lineNum.toString() +
          " Expected type: " +
          ValueTypeNames[ValueTypeEnum.DOUBLE] +
          " or " +
          ValueTypeNames[ValueTypeEnum.STRING] +
          " but got: " +
          ValueTypeNames[left.type]
            );
            return new ValueType(ValueTypeEnum.Error, expression.lineNum);
        }

        if (
            expression.operator === "-" ||
      expression.operator === "*" ||
      expression.operator === "/" ||
      expression.operator === "%"
        ) {
            if (
                (left.type === ValueTypeEnum.DOUBLE &&
          right.type === ValueTypeEnum.DOUBLE) ||
        (right.type === ValueTypeEnum.DOUBLE &&
          left.type === ValueTypeEnum.INT) ||
        (right.type === ValueTypeEnum.INT && left.type === ValueTypeEnum.DOUBLE)
            ) {
                expression.type = new ValueType(
                    ValueTypeEnum.DOUBLE,
                    expression.lineNum
                );
                return new ValueType(ValueTypeEnum.DOUBLE, expression.lineNum);
            }
            if (left.type === ValueTypeEnum.INT && right.type === ValueTypeEnum.INT) {
                expression.type = new ValueType(ValueTypeEnum.INT, expression.lineNum);
                return new ValueType(ValueTypeEnum.INT, expression.lineNum);
            }
            this.errors.push(
                "Line: " +
          expression.lineNum.toString() +
          " Expected type: " +
          ValueTypeNames[ValueTypeEnum.DOUBLE] +
          " but got: " +
          ValueTypeNames[left.type]
            );
            return new ValueType(ValueTypeEnum.Error, expression.lineNum);
        }

        if (expression.operator === "==" || expression.operator === "!=") {
            if (
                (right.type === ValueTypeEnum.DOUBLE &&
          left.type === ValueTypeEnum.INT) ||
        (right.type === ValueTypeEnum.INT && left.type === ValueTypeEnum.DOUBLE)
            ) {
                expression.type = new ValueType(
                    ValueTypeEnum.DOUBLE,
                    expression.lineNum
                );
                return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
            } else if (left.type !== right.type) {
                this.errors.push(
                    "Line: " +
            expression.lineNum.toString() +
            " Expected type: " +
            ValueTypeNames[left.type] +
            " but got: " +
            ValueTypeNames[right.type]
                );
                return new ValueType(ValueTypeEnum.Error, expression.lineNum);
            }
            expression.type = new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
            return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
        }

        if (
            expression.operator === ">" ||
      expression.operator === "<" ||
      expression.operator === ">=" ||
      expression.operator === "<="
        ) {
            if (
                (right.type === ValueTypeEnum.DOUBLE &&
          left.type === ValueTypeEnum.DOUBLE) ||
        (right.type === ValueTypeEnum.DOUBLE &&
          left.type === ValueTypeEnum.INT) ||
        (right.type === ValueTypeEnum.INT && left.type === ValueTypeEnum.DOUBLE)
            ) {
                expression.type = new ValueType(
                    ValueTypeEnum.DOUBLE,
                    expression.lineNum
                );
                return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
            }

            if (left.type === ValueTypeEnum.INT && right.type === ValueTypeEnum.INT) {
                expression.type = new ValueType(ValueTypeEnum.INT, expression.lineNum);
                return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
            }

            this.errors.push(
                "Line: " +
          expression.lineNum.toString() +
          " Expected type: " +
          ValueTypeNames[ValueTypeEnum.DOUBLE] +
          " but got: " +
          ValueTypeNames[left.type]
            );
            return new ValueType(ValueTypeEnum.Error, expression.lineNum);
        }

        if (expression.operator === "&&" || expression.operator === "||") {
            if (
                left.type !== ValueTypeEnum.BOOL ||
        right.type !== ValueTypeEnum.BOOL
            ) {
                this.errors.push(
                    "Line: " +
            expression.lineNum.toString() +
            " Expected type: " +
            ValueTypeNames[ValueTypeEnum.BOOL] +
            " but got: " +
            ValueTypeNames[left.type]
                );
            }
            expression.type = new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
            return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
        }

        this.errors.push(
            "Line: " +
        expression.lineNum.toString() +
        " Operator " +
        expression.operator +
        " not supported"
        );
        return new ValueType(ValueTypeEnum.Error, expression.lineNum);
    }

    checkFunctionDeclaration(
        statement: FunctionDeclaration,
        varEnv: VarEnv,
        funcEnv: FuncEnv
    ): StatementType {
        const type = funcEnv.lookUp(statement.name.value);
        if (type !== null) {
            this.errors.push(
                "FunctionObject " +
          statement.name.value +
          " already declared in Line: " +
          statement.lineNum.toString()
            );
        }
        funcEnv.addFunc(
            statement.name.value,
            statement.returnType,
            statement.parameters,
            varEnv
        );
        let returnType: ValueType | null = null;
        if (statement.returnType instanceof ValueType) {
            returnType = statement.returnType as ValueType;
        }
        varEnv = varEnv.enterScope();
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            const key = statement.parameters.keys()[i];
            const type = statement.parameters.get(key);

            varEnv.addVar(key, type);
        }
        this.checkStatement(statement.body!, varEnv, funcEnv, returnType);
        statement.varEnv = varEnv;
        return new StatementType(
            StatementTypeEnum.FUNCTION_DECLARATION,
            statement.lineNum
        );
    }

    checkUnaryExpression(
        expression: UnaryExpression,
        varEnv: VarEnv,
        funcEnv: FuncEnv
    ): ValueType | null {
        const typeOfExpression = this.checkExpression(
            expression.primaryOrRight,
            varEnv,
            funcEnv
        );
        if (typeOfExpression === null || !(typeOfExpression instanceof ValueType)) {
            this.errors.push(
                "Line: " +
          expression.lineNum.toString() +
          " Expected type: " +
          ValueTypeNames[ValueTypeEnum.DOUBLE] +
          " or " +
          ValueTypeNames[ValueTypeEnum.BOOL] +
          " but got: " +
          ValueTypeNames[ValueTypeEnum.Error]
            );
            return null;
        }

        const type = typeOfExpression as ValueType;
        if (expression.operator === "!") {
            if (type.type !== ValueTypeEnum.BOOL) {
                this.errors.push(
                    "Line: " +
            expression.lineNum.toString() +
            " Expected type: " +
            ValueTypeNames[ValueTypeEnum.BOOL] +
            " but got: " +
            ValueTypeNames[type.type]
                );
                return new ValueType(ValueTypeEnum.Error, expression.lineNum);
            }
            expression.type = type;
            return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
        }
        if (expression.operator === "-") {
            if (
                type.type !== ValueTypeEnum.DOUBLE &&
        type.type !== ValueTypeEnum.INT
            ) {
                this.errors.push(
                    "Line: " +
            expression.lineNum.toString() +
            " Expected type: " +
            ValueTypeNames[ValueTypeEnum.DOUBLE] +
            " but got: " +
            ValueTypeNames[type.type]
                );
                return new ValueType(ValueTypeEnum.Error, expression.lineNum);
            }
            expression.type = type;
            return new ValueType(ValueTypeEnum.DOUBLE, expression.lineNum);
        }
        this.errors.push(
            "Line: " +
        expression.lineNum.toString() +
        " Operator " +
        expression.operator +
        " not supported"
        );
        return new ValueType(ValueTypeEnum.Error, expression.lineNum);
    }

    checkDouble(term: Double, varEnv: VarEnv, funcEnv: FuncEnv): ValueType {
        term.type = new ValueType(ValueTypeEnum.DOUBLE, term.lineNum);
        return new ValueType(ValueTypeEnum.DOUBLE, term.lineNum);
    }

    checkInt(term: Int, varEnv: VarEnv, funcEnv: FuncEnv): ValueType {
        term.type = new ValueType(ValueTypeEnum.INT, term.lineNum);
        return new ValueType(ValueTypeEnum.INT, term.lineNum);
    }

    checkBool(term: Bool, varEnv: VarEnv, funcEnv: FuncEnv): AbstractType | null {
        term.type = new ValueType(ValueTypeEnum.BOOL, term.lineNum);
        return new ValueType(ValueTypeEnum.BOOL, term.lineNum);
    }

    checkString(
        param: ASTString,
        varEnv: VarEnv,
        funcEnv: FuncEnv
    ): AbstractType | null {
        param.type = new ValueType(ValueTypeEnum.STRING, param.lineNum);
        return new ValueType(ValueTypeEnum.STRING, param.lineNum);
    }

    checkIdentifier(
        term: Identifier,
        varEnv: VarEnv,
        funcEnv: FuncEnv
    ): ValueType {
        const type = varEnv.lookUpType(term.value) as ValueType | null;
        if (type === null) {
            this.errors.push(
                "0_Variable " +
          term.value +
          " not declared in Line: " +
          term.lineNum.toString()
            );
            return new ValueType(ValueTypeEnum.Error, term.lineNum);
        }
        term.type = type;
        return type as ValueType;
    }

    checkDeclaration(
        statement: Declaration,
        varEnv: VarEnv,
        funcEnv: FuncEnv
    ): StatementType {
        let exprType: ValueType | null = null;
        if (statement.expression !== null) {
            exprType = this.checkExpression(
        statement.expression!,
        varEnv,
        funcEnv
            ) as ValueType;
        }
        if (exprType !== null && exprType.type !== statement.type.type) {
            this.errors.push(
                "Line: " +
          statement.lineNum.toString() +
          " Expected type: " +
          ValueTypeNames[statement.type.type] +
          " but got: " +
          ValueTypeNames[exprType.type]
            );
        }
        if (statement.global) {
            varEnv.addGlobalVar(statement.identifier.value, statement.type);
        } else {
            varEnv.addVar(statement.identifier.value, statement.type);
        }
        return new StatementType(StatementTypeEnum.VAR_DECL, statement.lineNum);
    }

    checkWhile(
        statement: While,
        varEnv: VarEnv,
        funcEnv: FuncEnv,
        currentReturnType: ValueType | null
    ): StatementType {
        let initType: StatementType | null = null;
        if (statement.initiator !== null) {
            initType = this.checkStatement(
        statement.initiator!,
        varEnv,
        funcEnv,
        currentReturnType
            );
        }
        if (
            initType !== null &&
      initType.type !== StatementTypeEnum.VAR_DECL &&
      initType.type !== StatementTypeEnum.ASSIGNMENT
        ) {
            this.errors.push(
                "Line: " +
          statement.lineNum.toString() +
          " Expected type: " +
          StatementTypeNames[StatementTypeEnum.VAR_DECL] +
          " or " +
          StatementTypeNames[StatementTypeEnum.ASSIGNMENT] +
          " but got: " +
          StatementTypeNames[initType.type]
            );
        }
        const condType = this.checkExpression(statement.condition, varEnv, funcEnv);
        if (condType === null) {
            this.errors.push(
                "Line: " +
          statement.lineNum.toString() +
          " Expected type: " +
          ValueTypeNames[ValueTypeEnum.BOOL] +
          " but got: " +
          ValueTypeNames[ValueTypeEnum.Error]
            );
        }
        const condTypeValue = condType as ValueType;
        if (statement.body !== null) {
            this.checkStatement(statement.body!, varEnv, funcEnv, currentReturnType);
        }
        if (condTypeValue.type !== ValueTypeEnum.BOOL) {
            this.errors.push(
                "Line: " +
          statement.lineNum.toString() +
          " Expected type: " +
          ValueTypeNames[ValueTypeEnum.BOOL] +
          " but got: " +
          ValueTypeNames[condTypeValue.type]
            );
        }

        return new StatementType(StatementTypeEnum.WHILE, statement.lineNum);
    }

    checkAssignment(
        statement: Assignment,
        varEnv: VarEnv,
        funcEnv: FuncEnv
    ): StatementType {
        const exprType = this.checkExpression(
            statement.expression,
            varEnv,
            funcEnv
        ) as ValueType;
        const identifierType = varEnv.lookUpType(
            statement.identifier.value
        ) as ValueType | null;
        if (identifierType === null) {
            this.errors.push(
                "1_Variable " +
          statement.identifier.value +
          " not declared in Line: " +
          statement.lineNum.toString()
            );
            return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
        }
        if (exprType.type !== identifierType.type) {
            this.errors.push(
                "Line: " +
          statement.lineNum.toString() +
          " Expected type: " +
          ValueTypeNames[identifierType.type] +
          " but got: " +
          ValueTypeNames[exprType.type]
            );
            return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
        }

        return new StatementType(StatementTypeEnum.ASSIGNMENT, statement.lineNum);
    }

    checkIfStatement(
        statement: IfStatement,
        varEnv: VarEnv,
        funcEnv: FuncEnv,
        currentReturnType: ValueType | null
    ): StatementType {
        const condType = this.checkExpression(
            statement.condition,
            varEnv,
            funcEnv
        ) as ValueType;
        if (condType.type !== ValueTypeEnum.BOOL) {
            this.errors.push(
                "Line: " +
          statement.lineNum.toString() +
          " Expected type: " +
          ValueTypeNames[ValueTypeEnum.BOOL] +
          " but got: " +
          ValueTypeNames[condType.type]
            );
        }
        if (statement.body !== null) {
            this.checkStatement(statement.body!, varEnv, funcEnv, currentReturnType);
        }
        if (statement.else !== null) {
            this.checkStatement(statement.else!, varEnv, funcEnv, currentReturnType);
        }
        return new StatementType(StatementTypeEnum.IF, statement.lineNum);
    }

    private checkFunctionCallStatement(
        statement: FunctionCallStatement,
        varEnv: VarEnv,
        funcEnv: FuncEnv
    ): StatementType {
        const func = funcEnv.lookUp(statement.functionName);
        if (func === null) {
            this.errors.push(
                "Function " +
          statement.functionName +
          " not declared in Line: " +
          statement.lineNum.toString()
            );
            return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
        }
        if (func.parameters.keys().length !== statement.actualParameters.length) {
            this.errors.push(
                "Function " +
          statement.functionName +
          " expected " +
          func.parameters.keys().length.toString() +
          " parameters but got " +
          statement.actualParameters.length.toString() +
          " in Line: " +
          statement.lineNum.toString()
            );
            return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
        }
        for (let i = 0; i < statement.actualParameters.length; i++) {
            const paramType = this.checkExpression(
                statement.actualParameters[i],
                varEnv,
                funcEnv
            ) as ValueType;
            const expectedType = func.parameters.get(
                func.parameters.keys()[i]
            ) as ValueType;
            if (!this.checkIfTypesAreConvertible(paramType.type, expectedType.type)) {
                this.errors.push(
                    "Function " +
            statement.functionName +
            " expected parameter " +
            i.toString() +
            " to be of type " +
            ValueTypeNames[expectedType.type] +
            " but got " +
            ValueTypeNames[paramType.type] +
            " in Line: " +
            statement.lineNum.toString()
                );
                return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
            }
        }
        statement.expectedParameters = func.parameters.values();
        return new StatementType(
            StatementTypeEnum.FUNCTION_CALL,
            statement.lineNum
        );
    }

    private checkFunctionCallExpression(
        expression: FunctionCallExpression,
        varEnv: VarEnv,
        funcEnv: FuncEnv
    ): ValueType {
        const func = funcEnv.lookUp(expression.functionName);
        if (func === null) {
            this.errors.push(
                "Function " +
          expression.functionName +
          " not declared in Line: " +
          expression.lineNum.toString()
            );
            return new ValueType(ValueTypeEnum.Error, expression.lineNum);
        }
        if (func.parameters.keys().length !== expression.actualParameters.length) {
            this.errors.push(
                "Function " +
          expression.functionName +
          " expected " +
          func.parameters.keys().length.toString() +
          " parameters but got " +
          expression.actualParameters.length.toString() +
          " in Line: " +
          expression.lineNum.toString()
            );
            return new ValueType(ValueTypeEnum.Error, expression.lineNum);
        }
        for (let i = 0; i < expression.actualParameters.length; i++) {
            const paramType = this.checkExpression(
                expression.actualParameters[i],
                varEnv,
                funcEnv
            ) as ValueType;
            const expectedType = func.parameters.get(
                func.parameters.keys()[i]
            ) as ValueType;
            if (paramType.type !== expectedType.type) {
                this.errors.push(
                    "Function " +
            expression.functionName +
            " expected parameter " +
            i.toString() +
            " to be of type " +
            ValueTypeNames[expectedType.type] +
            " but got " +
            ValueTypeNames[paramType.type] +
            " in Line: " +
            expression.lineNum.toString()
                );
                return new ValueType(ValueTypeEnum.Error, expression.lineNum);
            }
        }

        expression.expectedParameters = func.parameters.values();

        if (func.returnType instanceof ValueType) {
            expression.type = func.returnType as ValueType;
            return func.returnType as ValueType;
        }
        this.errors.push(
            "Function " +
        expression.functionName +
        " has no return type in Line: " +
        expression.lineNum.toString()
        );
        return new ValueType(ValueTypeEnum.Error, expression.lineNum);
    }

    private checkImport(
        statement1: ImportFunction,
        varEnv: VarEnv,
        funcEnv: FuncEnv
    ): StatementType {
        const func = funcEnv.lookUp(statement1.name.value);
        if (func !== null) {
            this.errors.push(
                "FunctionObject " +
          statement1.name.value +
          " already declared in Line: " +
          statement1.lineNum.toString()
            );
        }
        varEnv = varEnv.enterScope();
        for (let i = 0; i < statement1.parameters.keys().length; i++) {
            const key = statement1.parameters.keys()[i];
            const type = statement1.parameters.get(key);

            varEnv.addVar(key, type);
        }
        funcEnv.addFunc(
            statement1.name.value,
            statement1.returnType,
            statement1.parameters,
            varEnv
        );
        return new StatementType(StatementTypeEnum.IMPORT, statement1.lineNum);
    }

    private checkIfTypesAreConvertible(
        type1: ValueTypeEnum,
        type2: ValueTypeEnum
    ): boolean {
        if (type1 === type2) {
            return true;
        }

        if (
            (type1 === ValueTypeEnum.DOUBLE && type2 === ValueTypeEnum.INT) ||
      (type1 === ValueTypeEnum.INT && type2 === ValueTypeEnum.DOUBLE)
        ) {
            return true;
        }

        if (
            (type1 === ValueTypeEnum.DOUBLE && type2 === ValueTypeEnum.STRING) ||
      (type1 === ValueTypeEnum.STRING && type2 === ValueTypeEnum.DOUBLE)
        ) {
            return true;
        }

        if (
            (type1 === ValueTypeEnum.STRING && type2 === ValueTypeEnum.INT) ||
      (type1 === ValueTypeEnum.INT && type2 === ValueTypeEnum.STRING)
        ) {
            return true;
        }

        if (
            (type1 === ValueTypeEnum.STRING && type2 === ValueTypeEnum.BOOL) ||
      (type1 === ValueTypeEnum.BOOL && type2 === ValueTypeEnum.STRING)
        ) {
            return true;
        }

        return false;
    }

    private checkReturnStatement(
        statement: Return,
        varEnv: VarEnv,
        funcEnv: FuncEnv,
        currentReturnType: ValueType | null
    ): StatementType {
        const returnType = this.checkExpression(
            statement.expression,
            varEnv,
            funcEnv
        ) as ValueType;
        if (currentReturnType === null) {
            return new StatementType(StatementTypeEnum.RETURN, statement.lineNum);
        }

        if (returnType.type != currentReturnType.type) {
            this.errors.push(
                "Line: " +
          statement.lineNum.toString() +
          " Expected type: " +
          ValueTypeNames[currentReturnType.type] +
          " but got: " +
          ValueTypeNames[returnType.type]
            );
            return new StatementType(StatementTypeEnum.ERROR, statement.lineNum);
        }

        return new StatementType(StatementTypeEnum.RETURN, statement.lineNum);
    }
}

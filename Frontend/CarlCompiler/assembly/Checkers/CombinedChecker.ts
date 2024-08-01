import {ASTVisitor} from "../AST/ASTVisitor";
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
import {FuncEnvironment} from "../Env/FuncEnvironment";
import {VarEnv} from "../Env/VarEnv";

export class CombinedChecker implements ASTVisitor<AbstractType | null> {
    public varEnv: VarEnv = new VarEnv();
    public funcEnv: FuncEnvironment = new FuncEnvironment();

    public errors: string[] = [];
    visitBinaryExpression(expression: BinaryExpression): ValueType {
        let left = expression.primaryOrLeft.accept<AbstractType | null>(this)! as ValueType;
        let right = expression.right.accept<AbstractType | null>(this)! as ValueType;
        if(expression.operator === "+" || expression.operator === "-" || expression.operator === "*" || expression.operator === "/") {
            if(left.type !== ValueTypeEnum.NUM || right.type !== ValueTypeEnum.NUM) {
                this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.NUM] + " but got: " + ValueTypeNames[left.type]);
            }
            return new ValueType(ValueTypeEnum.NUM, expression.lineNum);
        }

        if(expression.operator === "==" || expression.operator === "!=") {
            if(left.type !== right.type) {
                this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[left.type] + " but got: " + ValueTypeNames[right.type]);
            }
            return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
        }

        if(expression.operator === ">" || expression.operator === "<" || expression.operator === ">=" || expression.operator === "<=") {
            if(left.type !== ValueTypeEnum.NUM || right.type !== ValueTypeEnum.NUM) {
                this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.NUM] + " but got: " + ValueTypeNames[left.type]);
            }
            return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
        }

        if(expression.operator === "&&" || expression.operator === "||") {
            if(left.type !== ValueTypeEnum.BOOL || right.type !== ValueTypeEnum.BOOL) {
                this.errors.push("Line: " + expression.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[left.type]);
            }
            return new ValueType(ValueTypeEnum.BOOL, expression.lineNum);
        }

        this.errors.push("Line: " + expression.lineNum.toString() + " Operator " + expression.operator + " not supported");
        return left;
    }

    visitUnaryExpression(expression: UnaryExpression): ValueType {
        return expression.primaryOrRight.accept<AbstractType | null>(this)! as ValueType;
    }
    visitTerm(term: Term): ValueType {
        throw new Error("Method not implemented.");
    }
    visitNumber(term: Num): ValueType {
        return new ValueType(ValueTypeEnum.NUM, term.lineNum);
    }
    visitIdentifier(term: Identifier): ValueType {
        let type = this.varEnv.lookUp(term.name);
        if (type === null) {
            this.errors.push("Variable " + term.name + " not declared in Line: " + term.lineNum.toString());
            return new ValueType(ValueTypeEnum.Error, term.lineNum);
        }
        return type as ValueType;
    }
    visitDeclaration(param: Declaration): StatementType {
        let exprType: ValueType | null = null;
        if(param.expression !== null) {
            exprType = param.expression!.accept<AbstractType | null>(this)! as ValueType;
        }
        if(exprType !== null && exprType.type !== param.type.type) {
            this.errors.push("Line: " + param.lineNum.toString() + " Expected type: " + ValueTypeNames[param.type.type] + " but got: " + ValueTypeNames[exprType.type]);
        }
        this.varEnv.addVar(param.identifier.name, param.type);
        return new StatementType(StatementTypeEnum.VAR_DECL, param.lineNum);
    }
    visitValueType(type: ValueType): ValueType {
        throw new Error("Method not implemented.");
    }
    visitProgram(statement: Program): StatementType {
        for (let i = 0; i < statement.body.length; i++) {
            statement.body[i].accept<AbstractType | null>(this);
        }
        return new StatementType(StatementTypeEnum.PROGRAM, statement.lineNum);
    }
    visitPrint(statement: Print): StatementType {
        statement.expression.accept<AbstractType | null>(this);
        return new StatementType(StatementTypeEnum.PRINT, statement.lineNum);
    }
    visitWhile(statement: While): StatementType {
        let declType: StatementType | null = null;
        if(statement.declaration !== null) {
            declType = statement.declaration!.accept<AbstractType | null>(this)! as StatementType;
        }
        if(declType !== null && declType.type !== StatementTypeEnum.VAR_DECL) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + StatementTypeNames[StatementTypeEnum.VAR_DECL] + " but got: " + StatementTypeNames[declType.type]);
        }
        let condType = statement.condition.accept<AbstractType | null>(this)! as ValueType;
        let bodyType = statement.body
        if (condType.type !== ValueTypeEnum.BOOL) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[condType.type]);
        }

        return new StatementType(StatementTypeEnum.WHILE, statement.lineNum);
    }
    visitAssignment(statement: Assignment): StatementType {
        let exprType = statement.expression.accept<AbstractType | null>(this)! as ValueType;
        let identifierType = statement.identifier.accept<AbstractType | null>(this)! as ValueType;
        if (exprType.type !== identifierType.type) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[identifierType.type] + " but got: " + ValueTypeNames[exprType.type]);
        }

        return new StatementType(StatementTypeEnum.ASSIGNMENT, statement.lineNum);
    }

    visitStatementType(statement: StatementType): AbstractType | null {
        throw new Error("Method not implemented.");
    }

}

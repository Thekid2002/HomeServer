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
import {IfStatement} from "../AST/Nodes/Statements/IfStatement";
import {CompoundStatement} from "../AST/Nodes/Statements/CompoundStatement";
import {ASTString} from "../AST/Nodes/Expressions/Terms/ASTString";

export class CombinedChecker implements ASTVisitor<AbstractType | null> {
    public varEnv: VarEnv = new VarEnv();
    public funcEnv: FuncEnvironment = new FuncEnvironment();

    public errors: string[] = [];

    visitCompoundStatement(statement: CompoundStatement): AbstractType | null {
        let left = statement.left.accept<AbstractType | null>(this);
        let right = statement.right.accept<AbstractType | null>(this);
        return left;
    }

    visitBinaryExpression(expression: BinaryExpression): ValueType {
        let left = expression.primaryOrLeft.accept<AbstractType | null>(this)! as ValueType;
        let right = expression.right.accept<AbstractType | null>(this)! as ValueType;

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

        if(expression.operator === "-" || expression.operator === "*" || expression.operator === "/") {
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

    visitUnaryExpression(expression: UnaryExpression): ValueType {
        return expression.primaryOrRight.accept<AbstractType | null>(this)! as ValueType;
    }

    visitTerm(term: Term): ValueType {
        throw new Error("Method not implemented.");
    }

    visitNumber(term: Num): ValueType {
        return new ValueType(ValueTypeEnum.NUM, term.lineNum);
    }

    visitString(param: ASTString): AbstractType | null {
        return new ValueType(ValueTypeEnum.STRING, param.lineNum);
    }

    visitIdentifier(term: Identifier): ValueType {
        let type = this.varEnv.lookUp(term.value);
        if (type === null) {
            this.errors.push("Variable " + term.value + " not declared in Line: " + term.lineNum.toString());
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
        this.varEnv.addVar(param.identifier.value, param.type);
        return new StatementType(StatementTypeEnum.VAR_DECL, param.lineNum);
    }

    visitValueType(type: ValueType): ValueType {
        throw new Error("Method not implemented.");
    }

    visitProgram(statement: Program): StatementType {
        if(statement.body !== null) {
            statement.body!.accept<AbstractType | null>(this);
        }
        return new StatementType(StatementTypeEnum.PROGRAM, statement.lineNum);
    }
    visitPrint(statement: Print): StatementType {
        let type = statement.expression.accept<AbstractType | null>(this);
        if (type === null) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.NUM] + " but got: " + ValueTypeNames[ValueTypeEnum.Error]);
        }
        statement.type = type as ValueType;
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
        let condType = statement.condition.accept<AbstractType | null>(this);
        if(condType === null) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[ValueTypeEnum.Error]);
        }
        let condTypeValue = condType as ValueType;
        if(statement.body !== null) {
            statement.body!.accept<AbstractType | null>(this);
        }
        if (condTypeValue.type !== ValueTypeEnum.BOOL) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[condTypeValue.type]);
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

    visitIfStatement(statement: IfStatement): AbstractType | null {
        let condType = statement.condition.accept<AbstractType | null>(this)! as ValueType;
        if (condType.type !== ValueTypeEnum.BOOL) {
            this.errors.push("Line: " + statement.lineNum.toString() + " Expected type: " + ValueTypeNames[ValueTypeEnum.BOOL] + " but got: " + ValueTypeNames[condType.type]);
        }
        let body: AbstractType | null = null;
        if (statement.body !== null) {
            body = statement.body!.accept<AbstractType | null>(this);
        }

        if (statement.else !== null) {
            statement.else!.accept<AbstractType | null>(this);
        }
        return new StatementType(StatementTypeEnum.IF, statement.lineNum);
    }
}

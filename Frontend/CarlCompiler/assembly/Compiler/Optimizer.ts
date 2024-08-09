import {UnaryExpression} from "../AST/Nodes/Expressions/UnaryExpression";
import {ValObject} from "../Env/Values/ValObject";
import {ValBool} from "../Env/Values/ValBool";
import {ValNum} from "../Env/Values/ValNum";
import {BinaryExpression} from "../AST/Nodes/Expressions/BinaryExpression";
import {Identifier} from "../AST/Nodes/Expressions/Terms/Identifier";
import {Num} from "../AST/Nodes/Expressions/Terms/Num";
import {While} from "../AST/Nodes/Statements/While";
import {Declaration} from "../AST/Nodes/Statements/Declaration";
import {Assignment} from "../AST/Nodes/Statements/Assignment";
import {Program} from "../AST/Nodes/Statements/Program";
import {VarEnv} from "../Env/VarEnv";
import {ASTString} from "../AST/Nodes/Expressions/Terms/ASTString";
import {ValString} from "../Env/Values/ValString";
import {IfStatement} from "../AST/Nodes/Statements/IfStatement";
import {Print} from "../AST/Nodes/Statements/Print";
import {CompoundStatement} from "../AST/Nodes/Statements/CompoundStatement";
import {AbstractStatement} from "../AST/Nodes/Statements/AbstractStatement";
import {AbstractExpression} from "../AST/Nodes/Expressions/AbstractExpression";

export class Optimizer {
    varEnv: VarEnv;
    prints: string[] = [];

    constructor(varEnv: VarEnv) {
        this.varEnv = varEnv;
    }

    optimize(ast: Program): void {
        this.optimizeProgram(ast);
    }

    private optimizeProgram(statement: Program): ValObject | null {
        if (statement.body !== null) {
            statement.body = this.optimizeStatement(statement.body!);
        }
        return null;
    }

    private optimizeStatement(statement: AbstractStatement): AbstractStatement | null {
        if (statement instanceof Declaration) {
            return this.optimizeDeclaration(statement as Declaration);
        }
        if (statement instanceof Assignment) {
            return this.optimizeAssignment(statement as Assignment);
        }
        if (statement instanceof IfStatement) {
            return this.optimizeIfStatement(statement as IfStatement);
        }
        if (statement instanceof While) {
            return this.optimizeWhile(statement as While);
        }
        if (statement instanceof Print) {
            return this.optimizePrint(statement as Print);
        }
        if (statement instanceof CompoundStatement) {
            return this.optimizeCompoundStatement(statement as CompoundStatement);
        }
        throw new Error("Unknown statement type");
    }

    private optimizeDeclaration(statement: Declaration): Declaration | null {
        let identifier = statement.identifier;
        if (this.varEnv.lookUpValue(identifier.value) != null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Variable " + identifier.value + " already declared");
        }

        let value: ValObject | null = null;
        if (statement.expression !== null) {
            value = this.optimizeExpression(statement.expression!);
            this.varEnv.setVarVal(identifier.value, value!);
        }

        return statement;
    }

    private optimizeAssignment(statement: Assignment): Assignment | null {
        let value = this.optimizeExpression(statement.expression);
        if (value == null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
        }

        let prevVal = this.varEnv.lookUpValue(statement.identifier.value);
        if (prevVal == null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Variable " + statement.identifier.value + " not declared");
        }

        this.varEnv.setVarVal(statement.identifier.value, value);
        return statement;
    }

    private optimizeIfStatement(statement: IfStatement): AbstractStatement | null {
        let condition = this.optimizeExpression(statement.condition);
        if (condition == null) {
            throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
        }

        if ((condition as ValBool).value) {
            if (statement.body !== null) {
                let body = this.optimizeStatement(statement.body!);
                if(body != null){
                    return body;
                }
            }else{
                return null;
            }
        } else {
            if (statement.else !== null) {
                let $else = this.optimizeStatement(statement.else!);
                if($else != null){
                    return $else;
                }
            }else{
                return null;
            }
        }

        return statement;
    }

    private optimizeWhile(statement: While): AbstractStatement | null {
        let statements: AbstractStatement[] = [];
        if (statement.initiator !== null) {
            let declaration = this.optimizeStatement(statement.initiator!);
            statements.push(declaration!);
        }
        let expression = this.optimizeExpression(statement.condition);
        let iterations = 0;
        while ((expression as ValBool).value) {
            iterations++;
            if (statement.body !== null) {
                let body = this.optimizeStatement(statement.body!.clone() as AbstractStatement);
                if(body != null) {
                    statements.push(body.clone() as AbstractStatement);
                }
            }
            expression = this.optimizeExpression(statement.condition);
            if (expression == null) {
                throw new Error("Line: " + statement.lineNum.toString() + " Value is null");
            }
            if(iterations%50000 == 0){
                console.log("Working on the optimization");
            }
        }
        if(statements.length === 0){
            return null;
        }
        let optimizedBody = this.optimizeListOfStatements(statements);
        return this.toCompoundStatement(optimizedBody);
    }

    private optimizePrint(print: Print): Print | null {
        return print;
    }

    private optimizeExpression(expression: AbstractExpression): ValObject | null {
        if (expression instanceof UnaryExpression) {
            return this.optimizeUnaryExpression(expression as UnaryExpression);
        }
        if (expression instanceof BinaryExpression) {
            return this.optimizeBinaryExpression(expression as BinaryExpression);
        }
        if (expression instanceof Identifier) {
            return this.optimizeIdentifier(expression as Identifier);
        }
        if (expression instanceof Num) {
            return this.optimizeNumber(expression as Num);
        }
        if (expression instanceof ASTString) {
            return this.optimizeString(expression as ASTString);
        }
        throw new Error("Unknown expression type");
    }

    private optimizeUnaryExpression(expression: UnaryExpression): ValObject | null {
        let right = this.optimizeExpression(expression.primaryOrRight);
        if (expression.operator == "!") {
            return new ValBool(!(right as ValBool).value);
        }

        if (expression.operator == "-") {
            return new ValNum(-(right as ValNum).value);
        }

        throw new Error("Unknown operator: " + expression.operator);
    }

    private optimizeBinaryExpression(expression: BinaryExpression): ValObject | null {
        let left = this.optimizeExpression(expression.primaryOrLeft);
        let right = this.optimizeExpression(expression.right);
        if (left === null || right === null) {
            throw new Error("Line: " + expression.lineNum.toString() + " Value is null");
        }

        if((left instanceof ValString) || (right instanceof ValString)){
            return null;
        }

        if (expression.operator == "+") {
            return new ValNum((left as ValNum).value + (right as ValNum).value);
        }

        if (expression.operator == "-") {
            return new ValNum((left as ValNum).value - (right as ValNum).value);
        }

        if (expression.operator == "==") {
            if (left instanceof ValNum && right instanceof ValNum) {
                return new ValBool((left as ValNum).value == (right as ValNum).value);
            }

            if (left instanceof ValBool && right instanceof ValBool) {
                return new ValBool((left as ValBool).value == (right as ValBool).value);
            }
        }

        if (expression.operator == "!=") {
            if (left instanceof ValNum && right instanceof ValNum) {
                return new ValBool((left as ValNum).value != (right as ValNum).value);
            }
            if (left instanceof ValBool && right instanceof ValBool) {
                return new ValBool((left as ValBool).value != (right as ValBool).value);
            }
        }

        if (expression.operator == "&&") {
            return new ValBool((left as ValBool).value && (right as ValBool).value);
        }

        if (expression.operator == "||") {
            return new ValBool((left as ValBool).value || (right as ValBool).value);
        }

        if (expression.operator == "*") {
            return new ValNum((left as ValNum).value * (right as ValNum).value);
        }

        if (expression.operator == "/") {
            return new ValNum((left as ValNum).value / (right as ValNum).value);
        }

        if (expression.operator == "%") {
            return new ValNum((left as ValNum).value % (right as ValNum).value);
        }

        if (expression.operator == "<") {
            return new ValBool((left as ValNum).value < (right as ValNum).value);
        }

        if (expression.operator == "<=") {
            return new ValBool((left as ValNum).value <= (right as ValNum).value);
        }

        if (expression.operator == ">") {
            return new ValBool((left as ValNum).value > (right as ValNum).value);
        }

        if (expression.operator == ">=") {
            return new ValBool((left as ValNum).value >= (right as ValNum).value);
        }

        if (expression.operator == "^") {
            return new ValNum(Math.pow((left as ValNum).value, (right as ValNum).value));
        }

        throw new Error("Unknown operator: " + expression.operator);
    }

    private optimizeIdentifier(term: Identifier): ValObject | null {
        let val = this.varEnv.lookUpValue(term.value);
        if (val === null) {
            throw new Error("Line: " + term.lineNum.toString() + " Variable " + term.value + " not declared");
        }
        return val;
    }

    private optimizeNumber(term: Num): ValObject | null {
        return new ValNum(parseFloat(term.value));
    }

    private optimizeString(param: ASTString): ValObject | null {
        return new ValString(param.value);
    }

    private optimizeCompoundStatement(statement: CompoundStatement): AbstractStatement | null {
        let left = this.optimizeStatement(statement.left);
        let right = this.optimizeStatement(statement.right);
        if(left != null && right != null) {
            statement.left = left;
            statement.right = right;
            return statement;
        }

        if(left != null){
            return left;
        }

        if(right != null){
            return right;
        }

        return null;
    }


    private toCompoundStatement(statements: Array<AbstractStatement>): AbstractStatement {
        if(statements.length === 0) {
            throw new Error("Empty statements");
        }

        if(statements.length === 1) {
            return statements[0];
        }

        return new CompoundStatement(statements[0], this.toCompoundStatement(statements.slice(1)), statements[0].lineNum);
    }

    private optimizeListOfStatements(statements: AbstractStatement[]): Array<AbstractStatement> {
        let optimizedStatements: Array<AbstractStatement> = [];
        for (let i = 0; i < statements.length; i++) {
            if(i+1 < statements.length){
                if(statements[i] instanceof Assignment){
                    let assignments = [statements[i] as Assignment];
                    while (i+1 < statements.length && statements[i+1] instanceof Assignment){
                        assignments.push(statements[i+1] as Assignment);
                        i++;
                    }
                    optimizedStatements.push(this.mergeAssignments(assignments));
                    continue;
                }
            }
            optimizedStatements.push(statements[i]);
        }
        return optimizedStatements;
    }

    private mergeAssignments(assignments: Array<Assignment>): Assignment {
        let identifier = assignments[0].identifier;
        let value = ((this.optimizeExpression(assignments[0].expression)) as ValNum).value - (this.optimizeExpression(identifier) as ValNum).value;
        for (let i = 1; i < assignments.length; i++) {
            value += ((this.optimizeExpression(assignments[i].expression)) as ValNum).value - (this.optimizeExpression(identifier) as ValNum).value;
        }
        return new Assignment(identifier, new Num(value.toString(), identifier.lineNum), identifier.lineNum);
    }
}

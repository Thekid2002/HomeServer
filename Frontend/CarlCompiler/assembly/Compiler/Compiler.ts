import { ASTVisitor } from "../AST/ASTVisitor";
import { UnaryExpression } from "../AST/Nodes/Expressions/UnaryExpression";
import { BinaryExpression } from "../AST/Nodes/Expressions/BinaryExpression";
import { Identifier } from "../AST/Nodes/Expressions/Terms/Identifier";
import { Num } from "../AST/Nodes/Expressions/Terms/Num";
import { Term } from "../AST/Nodes/Expressions/Terms/Term";
import { ValueType, ValueTypeEnum } from "../AST/Nodes/Types/ValueType";
import { Declaration } from "../AST/Nodes/Statements/Declaration";
import { Program } from "../AST/Nodes/Statements/Program";
import { Print } from "../AST/Nodes/Statements/Print";
import { While } from "../AST/Nodes/Statements/While";
import { Assignment } from "../AST/Nodes/Statements/Assignment";
import { StatementType } from "../AST/Nodes/Types/StatementType";
import {VarEnv} from "../Env/VarEnv";

export class Compiler implements ASTVisitor<string> {
    varEnv: VarEnv;
    wasmCode: string[] = [];
    globalDeclarations: string[] = [];
    functionDeclarations: string[] = [];
    varCount: i32 = 0;
    funcCount: i32 = 0;

    constructor() {
        this.varEnv = new VarEnv();
        this.globalDeclarations = [
        ];
        this.functionDeclarations = [
        ];
    }

    visitStatementType(statement: StatementType): string {
        throw new Error("Method not implemented.");
    }

    visitAssignment(statement: Assignment): string {
        let expr = statement.expression.accept<string>(this);
        return `${expr}\nlocal.set $${statement.identifier.name}`;
    }

    visitWhile(statement: While): string {
        let start: i32 = this.funcCount;
        this.funcCount++;
        let declaration = statement.declaration !== null ? statement.declaration!.accept<string>(this) : "";
        let condition = statement.condition.accept<string>(this);
        let body: string = "";
        for (let i = 0; i < statement.body.length; i++) {
            body += statement.body[i].accept<string>(this) + "\n";
        }
        return '' +
            `${declaration}` + `\n` +
            '\n(loop $while' + `${start}` + '\n' +
            `${body}` + `\n` +
            `${condition}` + '\n' +
            '\n(br_if $while' + `${start}` + ')\n' +
            ')\n';
    }

    visitPrint(print: Print): string {
        let expr = print.expression.accept<string>(this);
        return `${expr}\ncall $log`;
    }

    visitProgram(statement: Program): string {
        let body: string = "";
        for (let i = 0; i < statement.body.length; i++) {
            body += statement.body[i].accept<string>(this) + "\n";
        }
        return '(module\n' +
            '(import "console" "log" (func $log (param f64)))\n' +
            this.globalDeclarations.join("\n") + '\n' +
            this.functionDeclarations.join("\n") + '\n' +
            '(func (export "_start")\n' +
            `${this.varEnv.getDeclarations()}` +
            body + '\n' +
            ')\n' +
            ')';
    }

    visitUnaryExpression(expression: UnaryExpression): string {
        let right = expression.primaryOrRight.accept<string>(this);
        if (expression.operator === "-") {
            return `${right}\nf64.neg`;
        }

        if (expression.operator === "!") {
            return `${right}\ni32.eqz`;
        }
        throw new Error("Unknown operator: " + expression.operator);
    }

    visitBinaryExpression(expression: BinaryExpression): string {
        let left = expression.primaryOrLeft.accept<string>(this);
        let right = expression.right.accept<string>(this);

        return `${left}\n${right}\n${this.getOperator(expression.operator)}`;
    }

    visitIdentifier(term: Identifier): string {
        return `local.get $${term.name}`;
    }

    visitNumber(term: Num): string {
        return `f64.const ${term.value}`;
    }

    visitTerm(term: Term): string {
        return term.accept<string>(this);
    }

    visitDeclaration(statement: Declaration): string {
        if (this.varEnv.lookUp(statement.identifier.name) !== null) {
            throw new Error("Variable " + statement.identifier.name + " already declared");
        }
        this.varEnv.addVar(statement.identifier.name, statement.type);
        this.varCount++;
        let string = "";
        if (statement.expression !== null) {
            let expr = statement.expression!.accept<string>(this);
            string += `\n${expr}\nlocal.set $${statement.identifier.name}`;
        }
        return string;
    }

    visitValueType(type: ValueType): string {
        if (type.type === ValueTypeEnum.NUM) {
            return `f64`;
        }
        if (type.type === ValueTypeEnum.BOOL) {
            return `i32`;
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
}

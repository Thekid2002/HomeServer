import {ASTVisitor} from "../AST/ASTVisitor";
import {Identifier} from "../AST/Nodes/Expressions/Terms/Identifier";
import {BinaryExpression} from "../AST/Nodes/Expressions/BinaryExpression";
import {StatementType} from "../AST/Nodes/Types/StatementType";
import {ValueType} from "../AST/Nodes/Types/ValueType";
import {While} from "../AST/Nodes/Statements/While";
import {Assignment} from "../AST/Nodes/Statements/Assignment";
import {Declaration} from "../AST/Nodes/Statements/Declaration";
import {Num} from "../AST/Nodes/Expressions/Terms/Num";
import {Print} from "../AST/Nodes/Statements/Print";
import {Program} from "../AST/Nodes/Statements/Program";
import {Term} from "../AST/Nodes/Expressions/Terms/Term";
import {UnaryExpression} from "../AST/Nodes/Expressions/UnaryExpression";
import {LivenessAnalysis} from "./LivenessAnalysis";

export class LivenessChecker implements ASTVisitor<void>{
    livenessAnalysis: LivenessAnalysis;
    currentLiveFuncs: Map<Identifier, string | null>;

    errors: string[] = [];

    constructor() {
        this.livenessAnalysis = new LivenessAnalysis();
        this.currentLiveFuncs = new Map();
    }

    visitBinaryExpression(expression: BinaryExpression): void {
        expression.primaryOrLeft.accept<void>(this);
        expression.right.accept<void>(this);
    }
    visitUnaryExpression(expression: UnaryExpression): void {
        return;
    }
    visitTerm(term: Term): void {
        return;
    }
    visitNumber(term: Num): void {
        return;
    }
    visitIdentifier(term: Identifier): void {
        this.livenessAnalysis.pushLiveVar(term);
    }
    visitDeclaration(param: Declaration): void {
        if(param.expression !== null) {
            param.expression!.accept<void>(this);
        }
        this.livenessAnalysis.popLiveVar(param.identifier);
    }
    visitValueType(type: ValueType): void {
        return;
    }
    visitProgram(statement: Program): void {
        statement.live = true;
        for (let i = statement.body.length-1; i >= 0; i--) {
            statement.body[i].accept<void>(this);
        }
    }
    visitPrint(statement: Print): void {
        return;
    }
    visitWhile(statement: While): void {
        for (let i = statement.body.length-1; i >= 0; i--) {
            statement.body[i].accept<void>(this);
        }
        statement.condition.accept<void>(this);
        if(statement.declaration !== null) {
            statement.declaration!.accept<void>(this);
        }
        statement.liveVariables = this.livenessAnalysis.currentLiveVars;
    }
    visitAssignment(statement: Assignment): void {
        statement.expression.accept<void>(this);
    }
    visitStatementType(statement: StatementType): void {
        return;
    }
}

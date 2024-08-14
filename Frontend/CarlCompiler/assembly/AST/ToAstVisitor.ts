import {ParseVisitor} from "../Parser/ParseVisitor";
import {ParseEqualityExpression} from "../Parser/Expressions/ParseEqualityExpression";
import {ParseExpression} from "../Parser/Expressions/ParseExpression";
import {Identifier as ASTIdentifier} from "./Nodes/Expressions/Terms/Identifier";
import {ParseIdentifier} from "../Parser/Expressions/Terms/ParseIdentifier";
import {ParseMultiplicativeExpression} from "../Parser/Expressions/ParseMultiplicativeExpression";
import {Int} from "./Nodes/Expressions/Terms/Int";
import {ParseInt} from "../Parser/Expressions/Terms/ParseInt";
import {BinaryExpression} from "./Nodes/Expressions/BinaryExpression";
import {ParseAdditiveExpression} from "../Parser/Expressions/ParseAdditiveExpression";
import {ParseUnaryExpression} from "../Parser/Expressions/ParseUnaryExpression";
import {UnaryExpression} from "./Nodes/Expressions/UnaryExpression";
import {Term} from "./Nodes/Expressions/Terms/Term";
import {ParseTerm} from "../Parser/Expressions/Terms/ParseTerm";
import {ParseRelationalExpression} from "../Parser/Expressions/ParseRelationalExpression";
import {AbstractExpression} from "./Nodes/Expressions/AbstractExpression";
import {ParsePowExpression} from "../Parser/Expressions/ParsePowExpression";
import {AbstractNode} from "./Nodes/AbstractNode";
import {ParseType} from "../Parser/Expressions/Terms/ParseType";
import {ParseDeclaration} from "../Parser/Statements/ParseDeclaration";
import {Declaration} from "./Nodes/Statements/Declaration";
import {ValueType, ValueTypeEnum} from "./Nodes/Types/ValueType";
import {ParseProgram} from "../Parser/Statements/ParseProgram";
import {Program} from "./Nodes/Statements/Program";
import {AbstractStatement} from "./Nodes/Statements/AbstractStatement";
import {ParseLoopStatement} from "../Parser/Statements/ParseLoopStatement";
import {While} from "./Nodes/Statements/While";
import {ParseAssignment} from "../Parser/Statements/ParseAssignment";
import {Assignment} from "./Nodes/Statements/Assignment";
import {ParseIfStatement} from "../Parser/Statements/ParseIfStatement";
import {IfStatement} from "./Nodes/Statements/IfStatement";
import {ParseCompoundStatement} from "../Parser/Statements/ParseCompoundStatement";
import {CompoundStatement} from "./Nodes/Statements/CompoundStatement";
import {ParseString} from "../Parser/Expressions/Terms/ParseString";
import {ASTString as ASTString} from "./Nodes/Expressions/Terms/ASTString";
import {ParseIncrement} from "../Parser/Statements/ParseIncrement";
import {ParseBool} from "../Parser/Expressions/Terms/ParseBool";
import {Bool} from "./Nodes/Expressions/Terms/Bool";
import {ParseFunctionDeclaration} from "../Parser/Statements/ParseFunctionDeclaration";
import {FunctionDeclaration} from "./Nodes/Statements/FunctionDeclaration";
import {AbstractType} from "./Nodes/Types/AbstractType";
import {StatementType, StatementTypeEnum} from "./Nodes/Types/StatementType";
import { ParseFunctionCallStatement } from "../Parser/Statements/ParseFunctionCallStatement";
import {FunctionCallExpression} from "./Nodes/Expressions/FunctionCallExpression";
import {FunctionCallStatement} from "./Nodes/Statements/FunctionCallStatement";
import {ParseFunctionCallExpression} from "../Parser/Expressions/Terms/ParseFunctionCallExpression";
import { ParseReturn } from "../Parser/Statements/ParseReturn";
import { Return } from "./Nodes/Statements/Return";
import { ParseImport } from "../Parser/Statements/ParseImport";
import {ImportFunction} from "./Nodes/Statements/ImportFunction";
import { ParseDouble } from "../Parser/Expressions/Terms/ParseDouble";
import {Double} from "./Nodes/Expressions/Terms/Double";

export class ToAstVisitor implements ParseVisitor<AbstractNode> {
    visitInt(term: ParseInt): AbstractNode {
        return new Int(term.value.literal, term.lineNum);
    }

    visitDouble(term: ParseDouble): AbstractNode {
        return new Double(term.value.literal, term.lineNum);
    }

    visitImport(statement: ParseImport): AbstractNode {
        let parentPath = statement.parentPath.accept<AbstractNode>(this) as ASTString;
        let childPath = statement.childPath.accept<AbstractNode>(this) as ASTString;
        let functionDeclarationWithoutBody = statement.functionDeclarationWithoutBody.accept<AbstractNode>(this) as FunctionDeclaration;
        return new ImportFunction(parentPath.value, childPath.value, functionDeclarationWithoutBody, statement.lineNum);
    }

    visitReturn(statement: ParseReturn): AbstractNode {
        let expression: AbstractExpression | null = null;
        if (statement.expression !== null) {
            expression = statement.expression.accept<AbstractNode>(this) as AbstractExpression;
        }
        return new Return(expression!, statement.lineNum);
    }

    visitFunctionCallExpression(expression: ParseFunctionCallExpression): FunctionCallExpression {
        let functionName = expression.functionName.literal;
        let actualParameters = new Array<AbstractExpression>();
        for (let i = 0; i < expression.actualParameters.length; i++) {
            actualParameters.push(expression.actualParameters[i].accept<AbstractNode>(this) as AbstractExpression);
        }
        return new FunctionCallExpression(functionName, actualParameters, expression.lineNum);
    }

    visitFunctionCallStatement(statement: ParseFunctionCallStatement): AbstractNode {
        let functionName = statement.functionName.literal;
        let actualParameters = new Array<AbstractExpression>();
        for (let i = 0; i < statement.actualParameters.length; i++) {
            actualParameters.push(statement.actualParameters[i].accept<AbstractNode>(this) as AbstractExpression);
        }
        return new FunctionCallStatement(functionName, actualParameters, statement.lineNum);
    }

    visitFunction(statement: ParseFunctionDeclaration): AbstractNode {
        let returnType = statement.returnType.accept<AbstractNode>(this) as AbstractType;
        let name = statement.name.accept<AbstractNode>(this) as ASTIdentifier;
        let parameters = new Map<string, AbstractType>();
        for (let i = 0; i < statement.parameters.keys().length; i++) {
            let key = statement.parameters.keys()[i];
            parameters.set((key.accept<AbstractNode>(this) as ASTIdentifier).value, statement.parameters.get(key).accept<AbstractNode>(this) as AbstractType);
        }
        let body = statement.body != null ? statement.body!.accept<AbstractNode>(this) as AbstractStatement : null;
        return new FunctionDeclaration(returnType, name, parameters, body, statement.export, statement.lineNum);
    }

    visitString(param: ParseString): AbstractNode {
        return new ASTString(param.value.literal, param.lineNum);
    }

    visitIfStatement(statement: ParseIfStatement): AbstractNode {
        let condition = statement.condition.accept<AbstractNode>(this) as AbstractExpression;
        let body: AbstractStatement | null = null;
        if(statement.body !== null) {
            body = statement.body!.accept<AbstractNode>(this) as AbstractStatement;
        }
        let $else: AbstractStatement | null = null;
        if (statement.else !== null) {
            $else = statement.else!.accept<AbstractNode>(this) as AbstractStatement;
        }
        return new IfStatement(condition, body, $else, statement.lineNum);
    }

    visitAssignment(statement: ParseAssignment): AbstractNode {
        let identifier = statement.identifier.accept<AbstractNode>(this) as ASTIdentifier;
        let expression = statement.expression.accept<AbstractNode>(this) as AbstractExpression;
        return new Assignment(identifier, expression, statement.lineNum);
    }

    visitLoopStatement(statement: ParseLoopStatement): AbstractNode {
        let initiator: AbstractStatement | null = null;
        if(statement.initiator !== null) {
            initiator = statement.initiator!.accept<AbstractNode>(this) as AbstractStatement;
        }
        let expression = statement.condition.accept<AbstractNode>(this) as AbstractExpression;
        let body = statement.body.accept<AbstractNode>(this) as AbstractStatement;
        return new While(initiator, expression, body, statement.lineNum);
    }

    visitProgram(statement: ParseProgram): AbstractNode {
        let body: AbstractStatement | null = null;
        if(statement.body !== null) {
            body = statement.body!.accept<AbstractNode>(this) as AbstractStatement;
        }
        return new Program(body, statement.lineNum);
    }

    visitDeclaration(statement: ParseDeclaration): AbstractNode {
        let identifier = statement.identifier.accept<AbstractNode>(this) as ASTIdentifier;
        let type = statement.type.accept<AbstractNode>(this) as ValueType;
        let expression: AbstractExpression | null = null;
        if (statement.expression !== null) {
            expression = statement.expression!.accept<AbstractNode>(this) as AbstractExpression;
        }
        let $export = statement.export;
        return new Declaration(identifier, type, expression, $export, statement.global, statement.lineNum);
    }

    visitType(type: ParseType): AbstractNode {
        let typ: ValueTypeEnum = ValueTypeEnum.Error;
        if (type.name.literal === "int") {
            typ = ValueTypeEnum.INT;
        }

        if (type.name.literal === "string") {
            typ = ValueTypeEnum.STRING;
        }

        if (type.name.literal === "bool") {
            typ = ValueTypeEnum.BOOL;
        }

        if (type.name.literal === "double") {
            typ = ValueTypeEnum.DOUBLE;
        }

        if(type.name.literal === "void") {
            return new StatementType(StatementTypeEnum.VOID, type.lineNum);
        }

        if (typ === ValueTypeEnum.Error) {
            throw new Error("Invalid type: " + type.name.literal + " at line: " + type.lineNum.toString());
        }

        return new ValueType(typ, type.lineNum);
    }

    visitPowExpression(expression: ParsePowExpression): AbstractNode {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept<AbstractNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractNode>(this) as AbstractExpression;
        return new BinaryExpression(left, expression.operator!.literal, right, expression.lineNum);
    }

    visitAdditiveExpression(expression: ParseAdditiveExpression): AbstractNode {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept<AbstractNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractNode>(this) as AbstractExpression;
        return new BinaryExpression(left, expression.operator!.literal, right, expression.lineNum);
    }

    visitEqualityExpression(expression: ParseEqualityExpression): AbstractNode {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept<AbstractNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractNode>(this) as AbstractExpression;
        return new BinaryExpression(left, expression.operator!.literal, right, expression.lineNum);
    }

    visitExpression(expression: ParseExpression): AbstractNode {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept<AbstractNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractNode>(this) as AbstractExpression;
        return new BinaryExpression(left, expression.operator!.literal, right, expression.lineNum);

    }

    visitIdentifier(term: ParseIdentifier): AbstractNode {
        return new ASTIdentifier(term.name.literal, term.lineNum);
    }

    visitMultiplicativeExpression(expression: ParseMultiplicativeExpression): AbstractNode {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept<AbstractNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractNode>(this) as AbstractExpression;
        return new BinaryExpression(left, expression.operator!.literal, right, expression.lineNum);
    }

    visitNumber(term: ParseInt): AbstractNode {
        return new Int(term.value.literal, term.lineNum);
    }

    visitBool(term: ParseBool): AbstractNode {
        return new Bool(term.value.literal, term.lineNum);
    }

    visitRelationalExpression(expression: ParseRelationalExpression): AbstractNode {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept<AbstractNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractNode>(this) as AbstractExpression;
        return new BinaryExpression(left, expression.operator!.literal, right, expression.lineNum);
    }

    visitTerm(term: ParseTerm): AbstractNode {
        return new Term(term.value, term.lineNum);
    }

    visitUnaryExpression(expression: ParseUnaryExpression): AbstractNode {
        if (expression.operator === null) {
            return expression.primaryOrRight.accept<AbstractNode>(this);
        }
        let primaryOrRight: AbstractExpression = expression.primaryOrRight.accept<AbstractNode>(this) as AbstractExpression;
        return new UnaryExpression(expression.operator!.literal, primaryOrRight, expression.lineNum);
    }

    visitCompoundStatement(statement: ParseCompoundStatement): AbstractNode {
        let left = statement.left.accept<AbstractNode>(this);
        let right = statement.right.accept<AbstractNode>(this);
        return new CompoundStatement(left as AbstractStatement, right as AbstractStatement, statement.lineNum);
    }

    visitIncrement(statement: ParseIncrement): AbstractNode {
        let identifier = statement.identifier.accept<AbstractNode>(this) as ASTIdentifier;
        let operator: string | null = null;
        if(statement.operator === "++") {
            operator = "+";
        }
        if(statement.operator === "--") {
            operator = "-";
        }

        return new Assignment(identifier, new BinaryExpression(identifier, operator!, new Int("1", statement.lineNum), statement.lineNum), statement.lineNum);
    }

}

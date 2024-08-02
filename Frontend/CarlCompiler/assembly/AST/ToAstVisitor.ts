import {ParseVisitor} from "../Parser/ParseVisitor";
import {ParseEqualityExpression} from "../Parser/Expressions/ParseEqualityExpression";
import {ParseExpression} from "../Parser/Expressions/ParseExpression";
import {Identifier as ASTIdentifier} from "./Nodes/Expressions/Terms/Identifier";
import {ParseIdentifier} from "../Parser/Expressions/Terms/ParseIdentifier";
import {
    ParseMultiplicativeExpression
} from "../Parser/Expressions/ParseMultiplicativeExpression";
import {Num} from "./Nodes/Expressions/Terms/Num";
import {ParseNum} from "../Parser/Expressions/Terms/ParseNum";
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
import {ParsePrint} from "../Parser/Statements/ParsePrint";
import {Print} from "./Nodes/Statements/Print";
import {ParseLoopStatement} from "../Parser/Statements/ParseLoopStatement";
import {While} from "./Nodes/Statements/While";
import { ParseAssignment } from "../Parser/Statements/ParseAssignment";
import {Assignment} from "./Nodes/Statements/Assignment";
import { ParseIfStatement } from "../Parser/Statements/ParseIfStatement";
import {IfStatement} from "./Nodes/Statements/IfStatement";
import {ParseCompoundStatement} from "../Parser/Statements/ParseCompoundStatement";
import {CompoundStatement} from "./Nodes/Statements/CompoundStatement";
import { ParseString } from "../Parser/Expressions/Terms/ParseString";
import { ASTString as ASTString } from "./Nodes/Expressions/Terms/ASTString";

export class ToAstVisitor implements ParseVisitor<AbstractNode> {
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
        let declaration: Declaration | null = null;
        if(statement.declaration !== null) {
            declaration = statement.declaration!.accept<AbstractNode>(this) as Declaration;
        }
        let expression = statement.expression.accept<AbstractNode>(this) as AbstractExpression;
        let body = statement.body.accept<AbstractNode>(this) as AbstractStatement;
        return new While(declaration, expression, body, statement.lineNum);
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
        return new Declaration(identifier, type, expression, statement.lineNum);
    }

    visitType(type: ParseType): AbstractNode {
        let typ: ValueTypeEnum = ValueTypeEnum.Error;
        if (type.name.literal === "num") {
            typ = ValueTypeEnum.NUM;
        }
        if (type.name.literal === "bool") {
            typ = ValueTypeEnum.BOOL;
        }
        if (type.name.literal === "string") {
            typ = ValueTypeEnum.STRING;
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

    visitNumber(term: ParseNum): AbstractNode {
        return new Num(term.value.literal, term.lineNum);
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

    visitPrint(statement: ParsePrint): AbstractNode {
        let expression = statement.expression.accept<AbstractNode>(this) as AbstractExpression;
        return new Print(expression, statement.lineNum);
    }

    visitCompoundStatement(statement: ParseCompoundStatement): AbstractNode {
        let left = statement.left.accept<AbstractNode>(this);
        let right = statement.right.accept<AbstractNode>(this);
        return new CompoundStatement(left as AbstractStatement, right as AbstractStatement, statement.lineNum);
    }

}

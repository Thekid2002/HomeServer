import {ParseVisitor} from "../Parser/ParseVisitor";
import {EqualityExpression as ParseEqualityExpression} from "../Parser/Expressions/EqualityExpression";
import {Expression as ParseExpression} from "../Parser/Expressions/Expression";
import {Identifier as ASTIdentifier} from "./Nodes/Expressions/Terms/Identifier";
import {Identifier as ParseIdentifier} from "../Parser/Expressions/Terms/Identifier";
import {
    MultiplicativeExpression as ParseMultiplicativeExpression
} from "../Parser/Expressions/MultiplicativeExpression";
import {Num as ASTNum} from "./Nodes/Expressions/Terms/Num";
import {Num as ParseNum} from "../Parser/Expressions/Terms/Num";
import {BinaryExpression as ASTBinaryExpression} from "./Nodes/Expressions/BinaryExpression";
import {AdditiveExpression} from "../Parser/Expressions/AdditiveExpression";
import {UnaryExpression as ParseUnaryExpression} from "../Parser/Expressions/UnaryExpression";
import {UnaryExpression as ASTUnaryExpression} from "./Nodes/Expressions/UnaryExpression";
import {Term as ASTTerm} from "./Nodes/Expressions/Terms/Term";
import {Term as ParseTerm} from "../Parser/Expressions/Terms/Term";
import {RelationalExpression as ParseRelationalExpression} from "../Parser/Expressions/RelationalExpression";
import {AbstractExpression} from "./Nodes/Expressions/AbstractExpression";
import {PowExpression} from "../Parser/Expressions/PowExpression";
import {AbstractNode} from "./Nodes/AbstractNode";
import {Type} from "../Parser/Expressions/Terms/Type";
import {Declaration as ParseDeclaration} from "../Parser/Statements/Declaration";
import {Declaration as ASTDeclaration} from "./Nodes/Statements/Declaration";
import {ValueType, ValueTypeEnum} from "./Nodes/Types/ValueType";
import {Program as ParseProgram} from "../Parser/Statements/Program";
import {Program as ASTProgram} from "./Nodes/Statements/Program";
import {AbstractStatement} from "./Nodes/Statements/AbstractStatement";
import {Print as ParsePrint} from "../Parser/Statements/Print";
import {Print as ASTPrint} from "./Nodes/Statements/Print";
import {LoopStatement as ParseLoopStatement} from "../Parser/Statements/LoopStatement";
import {While} from "./Nodes/Statements/While";
import { Assignment as ParseAssignment } from "../Parser/Statements/Assignment";
import {Assignment as ASTAssignment} from "./Nodes/Statements/Assignment";

export class ToAstVisitor implements ParseVisitor<AbstractNode> {
    visitAssignment(statement: ParseAssignment): AbstractNode {
        let identifier = statement.identifier.accept<AbstractNode>(this) as ASTIdentifier;
        let expression = statement.expression.accept<AbstractNode>(this) as AbstractExpression;
        return new ASTAssignment(identifier, expression, statement.lineNum);
    }

    visitLoopStatement(statement: ParseLoopStatement): AbstractNode {
        let declaration: ASTDeclaration | null = null;
        if(statement.declaration !== null) {
            declaration = statement.declaration!.accept<AbstractNode>(this) as ASTDeclaration;
        }
        let expression = statement.expression.accept<AbstractNode>(this) as AbstractExpression;
        let body: AbstractStatement[] = [];
        for (let i = 0; i < statement.body.length; i++) {
            body.push(statement.body[i].accept<AbstractNode>(this) as AbstractStatement);
        }
        return new While(declaration, expression, body, statement.lineNum);
    }

    visitProgram(statement: ParseProgram): AbstractNode {
        let body: Array<AbstractStatement> = [];
        for (let i = 0; i < statement.body.length; i++) {
            body.push(statement.body[i].accept<AbstractNode>(this) as AbstractStatement);
        }
        return new ASTProgram(body, statement.lineNum);
    }

    visitDeclaration(statement: ParseDeclaration): AbstractNode {
        let identifier = statement.identifier.accept<AbstractNode>(this) as ASTIdentifier;
        let type = statement.type.accept<AbstractNode>(this) as ValueType;
        let expression: AbstractExpression | null = null;
        if (statement.expression !== null) {
            expression = statement.expression!.accept<AbstractNode>(this) as AbstractExpression;
        }
        return new ASTDeclaration(identifier, type, expression, statement.lineNum);
    }

    visitType(type: Type): AbstractNode {
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

    visitPowExpression(expression: PowExpression): AbstractNode {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept<AbstractNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractNode>(this) as AbstractExpression;
        return new ASTBinaryExpression(left, expression.operator!.literal, right, expression.lineNum);
    }

    visitAdditiveExpression(expression: AdditiveExpression): AbstractNode {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept<AbstractNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractNode>(this) as AbstractExpression;
        return new ASTBinaryExpression(left, expression.operator!.literal, right, expression.lineNum);
    }

    visitEqualityExpression(expression: ParseEqualityExpression): AbstractNode {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept<AbstractNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractNode>(this) as AbstractExpression;
        return new ASTBinaryExpression(left, expression.operator!.literal, right, expression.lineNum);
    }

    visitExpression(expression: ParseExpression): AbstractNode {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept<AbstractNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractNode>(this) as AbstractExpression;
        return new ASTBinaryExpression(left, expression.operator!.literal, right, expression.lineNum);

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
        return new ASTBinaryExpression(left, expression.operator!.literal, right, expression.lineNum);
    }

    visitNumber(term: ParseNum): AbstractNode {
        return new ASTNum(term.value.literal, term.lineNum);
    }

    visitRelationalExpression(expression: ParseRelationalExpression): AbstractNode {
        if (expression.right === null) {
            return expression.primaryOrLeft.accept<AbstractNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractNode>(this) as AbstractExpression;
        return new ASTBinaryExpression(left, expression.operator!.literal, right, expression.lineNum);
    }

    visitTerm(term: ParseTerm): AbstractNode {
        return new ASTTerm(term.value, term.lineNum);
    }

    visitUnaryExpression(expression: ParseUnaryExpression): AbstractNode {
        if (expression.operator === null) {
            return expression.primaryOrRight.accept<AbstractNode>(this);
        }
        let primaryOrRight: AbstractExpression = expression.primaryOrRight.accept<AbstractNode>(this) as AbstractExpression;
        return new ASTUnaryExpression(expression.operator!.literal, primaryOrRight, expression.lineNum);
    }

    visitPrint(statement: ParsePrint): AbstractNode {
        let expression = statement.expression.accept<AbstractNode>(this) as AbstractExpression;
        return new ASTPrint(expression, statement.lineNum);
    }

}

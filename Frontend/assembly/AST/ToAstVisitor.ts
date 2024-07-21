import {ParseVisitor} from "../Parser/ParseVisitor";
import {AbstractSyntaxNode} from "./AbstractSyntaxNode";
import {EqualityExpression as ASTEqualityExpression} from "./Expressions/EqualityExpression";
import {EqualityExpression as ParseEqualityExpression} from "../Parser/Expressions/EqualityExpression";
import {Expression as ASTExpression} from "./Expressions/Expression";
import {Expression as ParseExpression} from "../Parser/Expressions/Expression";
import {Identifier as ASTIdentifier} from "./Expressions/Terms/Identifier";
import {Identifier as ParseIdentifier} from "../Parser/Expressions/Terms/Identifier";
import {MultiplicativeExpression as ASTMultiplicativeExpression} from "./Expressions/MultiplicativeExpression";
import {MultiplicativeExpression as ParseMultiplicativeExpression} from "../Parser/Expressions/MultiplicativeExpression";
import {Num as ASTNum} from "./Expressions/Terms/Num";
import {Num as ParseNum} from "../Parser/Expressions/Terms/Num";
import {BinaryExpression as ASTBinaryExpression} from "./Expressions/BinaryExpression";
import {BinaryExpression as ParseBinaryExpression } from "../Parser/Expressions/BinaryExpression";
import {UnaryExpression as ParseUnaryExpression} from "../Parser/Expressions/UnaryExpression";
import {UnaryExpression as ASTUnaryExpression} from "./Expressions/UnaryExpression";
import {Term as ASTTerm} from "./Expressions/Terms/Term";
import {Term as ParseTerm} from "../Parser/Expressions/Terms/Term";
import {RelationalExpression as ParseRelationalExpression} from "../Parser/Expressions/RelationalExpression";
import {RelationalExpression as ASTRelationalExpression} from "./Expressions/RelationalExpression";
import {AbstractExpression} from "./Expressions/AbstractExpression";



export class ToAstVisitor implements ParseVisitor<AbstractSyntaxNode>{
    visitBinaryExpression(expression: ParseBinaryExpression): AbstractSyntaxNode {
        if(expression.right === null){
            return expression.primaryOrLeft.accept<AbstractSyntaxNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractSyntaxNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractSyntaxNode>(this) as AbstractExpression;
        return new ASTBinaryExpression(left, expression.operator!.literal!, right);
    }

    visitEqualityExpression(expression: ParseEqualityExpression): AbstractSyntaxNode {
        if(expression.right === null){
            return expression.primaryOrLeft.accept<AbstractSyntaxNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractSyntaxNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractSyntaxNode>(this) as AbstractExpression;
        return new ASTEqualityExpression(left, expression.operator!.literal!, right);
    }

    visitExpression(expression: ParseExpression): AbstractSyntaxNode {
        if(expression.right === null){
            return expression.primaryOrLeft.accept<AbstractSyntaxNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractSyntaxNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractSyntaxNode>(this) as AbstractExpression;
        return new ASTExpression(left, expression.operator!.literal!, right);

    }

    visitIdentifier(term: ParseIdentifier): AbstractSyntaxNode {
        return new ASTIdentifier(term.name.literal!);
    }

    visitMultiplicativeExpression(expression: ParseMultiplicativeExpression): AbstractSyntaxNode {
        if(expression.right === null){
            return expression.primaryOrLeft.accept<AbstractSyntaxNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractSyntaxNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractSyntaxNode>(this) as AbstractExpression;
        return new ASTMultiplicativeExpression(left, expression.operator!.literal!, right);
    }

    visitNumber(term: ParseNum): AbstractSyntaxNode {
        return new ASTNum(term.value.literal!);
    }

    visitRelationalExpression(expression: ParseRelationalExpression): AbstractSyntaxNode {
        if(expression.right === null){
            return expression.primaryOrLeft.accept<AbstractSyntaxNode>(this);
        }
        let left: AbstractExpression = expression.primaryOrLeft.accept<AbstractSyntaxNode>(this) as AbstractExpression;
        let right: AbstractExpression = expression.right!.accept<AbstractSyntaxNode>(this) as AbstractExpression;
        return new ASTRelationalExpression(left, expression.operator!.literal!, right);
    }

    visitTerm(term: ParseTerm): AbstractSyntaxNode {
        return new ASTTerm(term.value);
    }

    visitUnaryExpression(expression: ParseUnaryExpression): AbstractSyntaxNode {
        if(expression.operator === null) {
            return expression.primaryOrRight.accept<AbstractSyntaxNode>(this);
        }
        let primaryOrRight: AbstractExpression = expression.primaryOrRight.accept<AbstractSyntaxNode>(this) as AbstractExpression;
        return new ASTUnaryExpression(expression.operator!.literal!, primaryOrRight);
    }

}

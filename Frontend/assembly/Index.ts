import {Scanner} from "./Lexer/Scanner";
import {Parser} from "./Parser/Parser";
import {ParseTreePrinter} from "./Parser/ParseTreePrinter";
import {ToAstVisitor} from "./AST/ToAstVisitor";
import {AbstractSyntaxNode} from "./AST/AbstractSyntaxNode";
import {ASTPrinter} from "./AST/ASTPrinter";
import {Interpreter} from "./Interpreter/Interpreter";
import {Token} from "./Lexer/Token";

export function calculateViaLanguage(string: string): string {
    let scanner = new Scanner(string);
    let tokens = scanner.scanTokens();
    let parser = new Parser(tokens);
    let syntaxTree = parser.parse();
    let parseTreePrinter = new ParseTreePrinter();
    syntaxTree.accept<void>(parseTreePrinter);
    if(parser.errors.length > 0){
        return new value(parseTreePrinter.tree, [], 0, tokens, scanner.errors, parser.errors).toJsonString();
    }
    let toAstVisitor = new ToAstVisitor();
    let ast = syntaxTree.accept<AbstractSyntaxNode>(toAstVisitor);
    let astPrinter = new ASTPrinter();
    ast.accept<void>(astPrinter);
    let interpreter = new Interpreter();
    let finalValue: f64;
    finalValue = ast.accept<f64>(interpreter);
    return new value(parseTreePrinter.tree, astPrinter.tree, finalValue, tokens, scanner.errors, parser.errors).toJsonString();
}

class value {
    lexerErrors: string[];
    parse: string[];
    parseErrors: string[];
    ast: string[];

    value: f64;
    tokens: Token[];
    constructor(parse: string[], ast: string[], value: f64, tokens: Token[], lexerErrors: string[], parseErrors: string[]){
        this.parse = parse;
        this.ast = ast;
        this.value = value;
        this.tokens = tokens;
        this.lexerErrors = lexerErrors;
        this.parseErrors = parseErrors;
    }

    toJsonString(): string {
        let string = "{\n";
        string += "\"parse\": [";
        for (let i = 0; i < this.parse.length; i++) {
            string += "\"" + this.parse[i] + "\"";
            if (i < this.parse.length - 1) {
                string += ", ";
            }
        }
        string += "],\n";
        string += "\"ast\": [";
        for (let i = 0; i < this.ast.length; i++) {
            string += "\"" + this.ast[i] + "\"";
            if (i < this.ast.length - 1) {
                string += ", ";
            }
        }
        string += "],\n";
        string += "\"value\": " + this.value.toString() + ",\n";

        string += "\"tokens\": [";
        for (let i = 0; i < this.tokens.length; i++) {
            string += this.tokens[i].toJsonString();
            if (i < this.tokens.length - 1) {
                string += ", ";
            }
        }
        string += "],\n";
        string += "\"lexerErrors\": [";
        for (let i = 0; i < this.lexerErrors.length; i++) {
            string += "\"" + this.lexerErrors[i] + "\"";
            if (i < this.lexerErrors.length - 1) {
                string += ", ";
            }
        }
        string += "],\n";
        string += "\"parseErrors\": [";
        for (let i = 0; i < this.parseErrors.length; i++) {
            string += "\"" + this.parseErrors[i] + "\"";
            if (i < this.parseErrors.length - 1) {
                string += ", ";
            }
        }
        string += "]\n";
        string += "}";
        return string;
    }

}

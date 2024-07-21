import {Scanner} from "./Lexer/Scanner";
import {Parser} from "./Parser/Parser";
import {ParseTreePrinter} from "./Parser/ParseTreePrinter";
import {ToAstVisitor} from "./AST/ToAstVisitor";
import {AbstractSyntaxNode} from "./AST/AbstractSyntaxNode";
import {ASTPrinter} from "./AST/ASTPrinter";
import {Interpreter} from "./Interpreter/Interpreter";

export function calculateViaLanguage(string: string): string {
    let scanner = new Scanner(string);
    let tokens = scanner.scanTokens();
    let parser = new Parser(tokens);
    let syntaxTree = parser.parse();
    let parseTreePrinter = new ParseTreePrinter();
    syntaxTree.accept<void>(parseTreePrinter);
    console.log(" ");
    console.log("----- Parse Tree: -----");
    for (let i = parseTreePrinter.tree.length; i > 0; i--) {
        console.log(parseTreePrinter.tree[i - 1]);
    }
    let toAstVisitor = new ToAstVisitor();
    let ast = syntaxTree.accept<AbstractSyntaxNode>(toAstVisitor);
    let astPrinter = new ASTPrinter();
    console.log(" ");
    console.log("----- AST: -----");
    ast.accept<void>(astPrinter);
    for (let i = astPrinter.tree.length; i > 0; i--) {
        console.log(astPrinter.tree[i - 1]);
    }
    console.log(tokens.length.toString());
    console.log("Input: " + string);
    console.log(tokens.toString());
    for(let i = 0; i < scanner.errors.length; i++){
        console.log(scanner.errors[i].toString());
    }

    for (let i = 0; i < parser.errors.length; i++) {
        console.log(parser.errors[i].toString());
    }

    let interpreter = new Interpreter();

    let finalValue: f64 = ast.accept<f64>(interpreter);
    return new value(parseTreePrinter.tree, astPrinter.tree, finalValue).toJsonString();
}

class value {
    parse: string[];
    ast: string[];
    value: f64;
    constructor(parse: string[], ast: string[], value: f64){
        this.parse = parse;
        this.ast = ast;
        this.value = value;
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
        string += "\"value\": " + this.value.toString() + "\n";
        string += "}";
        return string;
    }
}

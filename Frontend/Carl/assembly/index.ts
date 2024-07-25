import {Scanner} from "./Lexer/Scanner";
import {Parser} from "./Parser/Parser";
import {ParseTreePrinter} from "./Parser/ParseTreePrinter";
import {ToAstVisitor} from "./AST/ToAstVisitor";
import {ASTPrinter} from "./AST/ASTPrinter";
import {Interpreter} from "./Interpreter/Interpreter";
import {Token} from "./Lexer/Token";
import {AbstractNode} from "./AST/Nodes/AbstractNode";
import {ValObject} from "./Interpreter/Values/ValObject";
import {VarEnvironment} from "./Interpreter/VarEnvironment";

export function calculateViaLanguage(string: string): string {
    let scanner = new Scanner(string);
    let tokens = scanner.scanTokens();
    if(scanner.errors.length > 0) {
        return new value([], [], null, tokens, scanner.errors, [], null, null).toJsonString()
    }
    let parser = new Parser(tokens);
    let syntaxTree = parser.parse();
    let parseTreePrinter = new ParseTreePrinter();
    if (syntaxTree !== null) {
        syntaxTree.accept<void>(parseTreePrinter);
    }
    if (parser.errors.length > 0) {
        return new value(parseTreePrinter.tree, [], null, tokens, scanner.errors, parser.errors, null, null).toJsonString();
    }
    let toAstVisitor = new ToAstVisitor();
    let ast = syntaxTree!.accept<AbstractNode>(toAstVisitor);
    let astPrinter = new ASTPrinter();
    ast.accept<void>(astPrinter);
    let interpreter = new Interpreter();
    let finalValue: ValObject | null;
    finalValue = ast.accept<ValObject | null>(interpreter);
    return new value(parseTreePrinter.tree, astPrinter.tree, finalValue, tokens, scanner.errors, parser.errors, interpreter.varEnv, interpreter.prints).toJsonString();
}

class value {
    lexerErrors: string[];
    parse: string[];
    parseErrors: string[];
    ast: string[];

    value: ValObject | null;
    tokens: Token[];
    varEnv: VarEnvironment | null;
    prints: string[];

    constructor(parse: string[], ast: string[], value: ValObject | null, tokens: Token[], lexerErrors: string[], parseErrors: string[],
                varEnv: VarEnvironment | null, prints: string[] | null) {
        this.parse = parse;
        this.ast = ast;
        this.value = value;
        this.tokens = tokens;
        this.lexerErrors = lexerErrors;
        this.parseErrors = parseErrors;
        this.varEnv = varEnv;
        if (prints == null) {
            prints = [];
        }
        this.prints = prints;
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
        string += "\"value\": ";
        string += "\"" + (this.value !== null ? this.value!.toJsonString() : "null") + "\",\n";

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
        string += "],\n";
        string += "\"varEnv\": ";
        string += (this.varEnv !== null ? this.varEnv!.toJsonString() : "\"null\"");
        string += ",\n";
        string += "\"prints\": [";
        string += this.prints.join(", ");
        string += "]\n";
        string += "}";
        return string;
    }

}

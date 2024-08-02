import {Scanner} from "./Lexer/Scanner";
import {Parser} from "./Parser/Parser";
import {ParseTreePrinter} from "./Parser/ParseTreePrinter";
import {ToAstVisitor} from "./AST/ToAstVisitor";
import {ASTPrinter} from "./AST/ASTPrinter";
import {Token} from "./Lexer/Token";
import {AbstractNode} from "./AST/Nodes/AbstractNode";
import {Compiler} from "./Compiler/Compiler";
import {CombinedChecker} from "./Checkers/CombinedChecker";
import {AbstractType} from "./AST/Nodes/Types/AbstractType";
import {LivenessChecker} from "./Checkers/LivenessChecker";
import {ParseProgram as ParseProgram} from "./Parser/Statements/ParseProgram";
import {Interpreter} from "./Interpreter/Interpreter";
import {VarEnv} from "./Env/VarEnv";
import {ValObject} from "./Env/Values/ValObject";

export function calculateViaLanguage(string: string, type: string): string {
    if (type === "compiler") {
        return compile(string);
    }

    if (type === "interpreter") {
        return interpret(string);
    }

    return "ERROR: can not not compile or interpret";
}

function scanAndParseAndToAst(string: string): CompilerResult {
    let scanner = new Scanner(string);
    let tokens = scanner.scanTokens();
    if(scanner.errors.length > 0) {
        for (let i = 0; i < scanner.errors.length; i++) {
            console.error(scanner.errors[i]);
        }
        return new CompilerResult(null, null, null, null, [], scanner.errors, [], null);
    }
    let parser = new Parser(tokens);
    let syntaxTree = parser.parse();
    let parseTreePrinter = new ParseTreePrinter();
    if (syntaxTree !== null) {
        syntaxTree.accept<void>(parseTreePrinter);
    }
    if (parser.errors.length > 0) {
        for (let i = 0; i < parser.errors.length; i++) {
            console.error(parser.errors[i]);
        }
        return new CompilerResult(parseTreePrinter.tree, syntaxTree, null, null, tokens, scanner.errors, parser.errors, null);
    }
    let toAstVisitor = new ToAstVisitor();
    let ast = syntaxTree!.accept<AbstractNode>(toAstVisitor);
    let astPrinter = new ASTPrinter();
    ast.accept<void>(astPrinter);
    let combinedChecker = new CombinedChecker();
    ast.accept<AbstractType | null>(combinedChecker);
    if (combinedChecker.errors.length > 0) {
        for (let i = 0; i < combinedChecker.errors.length; i++) {
            console.error(combinedChecker.errors[i]);
        }
        return new CompilerResult(parseTreePrinter.tree, syntaxTree, astPrinter.tree, ast, tokens, scanner.errors, parser.errors, null, combinedChecker.errors);
    }
    return new CompilerResult(parseTreePrinter.tree, syntaxTree, astPrinter.tree, ast, tokens, scanner.errors, parser.errors, combinedChecker.varEnv);
}

function interpret(string: string): string {
    let result = scanAndParseAndToAst(string);
    let ast = result.astTree;
    let interpreter = new Interpreter();
    if(ast === null) {
        return result.toJsonString();
    }
    ast.accept<ValObject | null>(interpreter);
    result.interpretOutput = interpreter.prints;
    return result.toJsonString();
}

function compile(string: string): string {
    let result = scanAndParseAndToAst(string);
    let ast = result.astTree!;
    /**let livenessAnalysis = new LivenessChecker();
    ast.accept<void>(livenessAnalysis);
    if(livenessAnalysis.errors.length > 0) {
        for (let i = 0; i < livenessAnalysis.errors.length; i++) {
            console.error(livenessAnalysis.errors[i]);
        }
    }*/
    let compiler = new Compiler();
    result.compilerOutput =  ast.accept<string>(compiler).replaceAll("\"", "\\\"").replaceAll("\n", "\\n");
    return result.toJsonString();
}

class CompilerResult {
    lexerErrors: string[] | null;
    parsePrint: string[] | null;
    parseTree: ParseProgram | null;
    parseErrors: string[] | null;
    combinedCheckerErrors: string[] | null;
    astPrint: string[] | null;
    astTree: AbstractNode | null;
    tokens: Token[] | null;
    checkEnv: VarEnv | null;
    compilerOutput: string | null;
    interpretOutput: string[] | null;

    constructor(parsePrint: string[] | null, parseTree: ParseProgram | null, astPrint: string[] | null, astTree: AbstractNode | null, tokens: Token[], lexerErrors: string[] | null, parseErrors: string[] | null,
                checkEnv: VarEnv | null, combinedCheckerErrors: string[] | null = null, compilerOutput: string | null = null, interpretOutput: string[] | null = null) {
        this.parsePrint = parsePrint;
        this.astPrint = astPrint;
        this.parseTree = parseTree;
        this.astTree = astTree;
        this.tokens = tokens;
        this.lexerErrors = lexerErrors;
        this.parseErrors = parseErrors;
        this.combinedCheckerErrors = combinedCheckerErrors !== null ? combinedCheckerErrors : [];
        this.compilerOutput = compilerOutput;
        this.interpretOutput = interpretOutput;
        this.checkEnv = checkEnv;
    }

    toJsonString(): string {
        let string = "{\n";
        string += "\"parsePrint\": [";
        if(this.parsePrint !== null) {
            for (let i = 0; i < this.parsePrint!.length; i++) {
                string += "\"" + this.parsePrint![i] + "\"";
                if (i < this.parsePrint!.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"astPrint\": [";
        if(this.astPrint !== null) {
            for (let i = 0; i < this.astPrint!.length; i++) {
                string += "\"" + this.astPrint![i] + "\"";
                if (i < this.astPrint!.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"tokens\": [";
        if(this.tokens !== null) {
            for (let i = 0; i < this.tokens!.length; i++) {
                string += this.tokens![i].toJsonString();
                if (i < this.tokens!.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"lexerErrors\": [";
        if (this.lexerErrors !== null) {
            for (let i = 0; i < this.lexerErrors!.length; i++) {
                string += "\"" + this.lexerErrors![i] + "\"";
                if (i < this.lexerErrors!.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"parseErrors\": [";
        if(this.parseErrors !== null) {
            for (let i = 0; i < this.parseErrors!.length; i++) {
                string += "\"" + this.parseErrors![i] + "\"";
                if (i < this.parseErrors!.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"combinedCheckerErrors\": [";
        if(this.combinedCheckerErrors !== null) {
            for (let i = 0; i < this.combinedCheckerErrors!.length; i++) {
                string += "\"" + this.combinedCheckerErrors![i] + "\"";
                if (i < this.combinedCheckerErrors!.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"checkEnv\": ";
        if(this.checkEnv !== null) {
         string += (this.checkEnv!.toJsonString());
        }else{
            string += "null";
        }
        string += ",\n";
        string += "\"compilerOutput\": ";
        if(this.compilerOutput !== null) {
            string += "\"" + this.compilerOutput! + "\"";
        }else{
            string += "null";
        }
        string += ",\n";
        string += "\"interpretOutput\": ";
        string += "[";
        if(this.interpretOutput !== null) {
            for (let i = 0; i < this.interpretOutput!.length; i++) {
                string += "\"" + this.interpretOutput![i] + "\"";
                if (i < this.interpretOutput!.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "]";
        string += "}\n";
        return string;
    }

}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateViaLanguage = calculateViaLanguage;
const Scanner_1 = require("./Lexer/Scanner");
const Parser_1 = require("./Parser/Parser");
const ParseTreePrinter_1 = require("./Parser/ParseTreePrinter");
const ToAstVisitor_1 = require("./AST/ToAstVisitor");
const ASTPrinter_1 = require("./AST/ASTPrinter");
const Compiler_1 = require("./Compiler/Compiler");
const CombinedChecker_1 = require("./Checkers/CombinedChecker");
const Interpreter_1 = require("./Interpreter/Interpreter");
const VarEnv_1 = require("./Env/VarEnv");
const FuncEnv_1 = require("./Env/FuncEnv");
function calculateViaLanguage(string, type) {
    if (type === "compiler") {
        return compile(string);
    }
    if (type === "interpreter") {
        return interpret(string);
    }
    return "ERROR: can not not compile or interpret";
}
function scanAndParseAndToAst(string) {
    VarEnv_1.VarEnv.resetGlobalVars();
    let scanner = new Scanner_1.Scanner(string);
    let tokens = scanner.scanTokens();
    if (scanner.errors.length > 0) {
        for (let i = 0; i < scanner.errors.length; i++) {
            console.error(scanner.errors[i]);
        }
        return new CompilerResult(null, null, null, null, [], scanner.errors, [], null, null);
    }
    let parser = new Parser_1.Parser(tokens);
    let syntaxTree = parser.parse();
    let parseTreePrinter = new ParseTreePrinter_1.ParseTreePrinter();
    if (syntaxTree === null) {
        return new CompilerResult(parseTreePrinter.tree, syntaxTree, null, null, tokens, scanner.errors, parser.errors, null, null, null, null);
    }
    syntaxTree.accept(parseTreePrinter);
    if (parser.errors.length > 0) {
        for (let i = 0; i < parser.errors.length; i++) {
            console.error(parser.errors[i]);
        }
        return new CompilerResult(parseTreePrinter.tree, syntaxTree, null, null, tokens, scanner.errors, parser.errors, null, null);
    }
    let toAstVisitor = new ToAstVisitor_1.ToAstVisitor();
    let ast = syntaxTree.accept(toAstVisitor);
    let astPrinter = new ASTPrinter_1.ASTPrinter();
    ast.accept(astPrinter);
    let combinedChecker = new CombinedChecker_1.CombinedChecker();
    let varEnv = new VarEnv_1.VarEnv(null);
    let funcEnv = new FuncEnv_1.FuncEnv(null);
    combinedChecker.checkProgram(ast, varEnv, funcEnv);
    if (combinedChecker.errors.length > 0) {
        for (let i = 0; i < combinedChecker.errors.length; i++) {
            console.error(combinedChecker.errors[i]);
        }
        return new CompilerResult(parseTreePrinter.tree, syntaxTree, astPrinter.tree, ast, tokens, scanner.errors, parser.errors, varEnv, funcEnv, combinedChecker.errors);
    }
    return new CompilerResult(parseTreePrinter.tree, syntaxTree, astPrinter.tree, ast, tokens, scanner.errors, parser.errors, varEnv, funcEnv);
}
function interpret(string) {
    let result = scanAndParseAndToAst(string);
    let ast = result.astTree;
    if (result.varEnv === null) {
        return result.toJsonString();
    }
    let interpreter = new Interpreter_1.Interpreter(result.varEnv);
    if (ast === null) {
        return result.toJsonString();
    }
    interpreter.evaluateProgram(ast);
    result.interpretOutput = interpreter.prints;
    return result.toJsonString();
}
function compile(string) {
    let result = scanAndParseAndToAst(string);
    if (result.lexerErrors !== null && result.lexerErrors.length > 0) {
        return result.toJsonString();
    }
    if (result.parseErrors !== null && result.parseErrors.length > 0) {
        return result.toJsonString();
    }
    if (result.combinedCheckerErrors !== null &&
        result.combinedCheckerErrors.length > 0) {
        return result.toJsonString();
    }
    if (result.astTree === null) {
        return result.toJsonString();
    }
    let ast = result.astTree;
    if (result.varEnv === null || result.funcEnv === null) {
        return result.toJsonString();
    }
    let compiler = new Compiler_1.Compiler();
    result.compilerOutput = compiler
        .compileProgram(ast)
        .replaceAll("\"", "\\\"")
        .replaceAll("\n", "\\n");
    return result.toJsonString();
}
class CompilerResult {
    constructor(parsePrint, parseTree, astPrint, astTree, tokens, lexerErrors, parseErrors, varEnv, funcEnv, combinedCheckerErrors = null, compilerOutput = null, interpretOutput = null) {
        this.parsePrint = parsePrint;
        this.astPrint = astPrint;
        this.parseTree = parseTree;
        this.astTree = astTree;
        this.tokens = tokens;
        this.lexerErrors = lexerErrors;
        this.parseErrors = parseErrors;
        this.combinedCheckerErrors =
            combinedCheckerErrors !== null ? combinedCheckerErrors : [];
        this.compilerOutput = compilerOutput !== null ? compilerOutput : "";
        this.interpretOutput = interpretOutput;
        this.varEnv = varEnv;
        this.funcEnv = funcEnv;
    }
    toJsonString() {
        let string = "{\n";
        string += "\"parsePrint\": [";
        if (this.parsePrint !== null) {
            for (let i = 0; i < this.parsePrint.length; i++) {
                string += "\"" + this.parsePrint[i] + "\"";
                if (i < this.parsePrint.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"astPrint\": [";
        if (this.astPrint !== null) {
            for (let i = 0; i < this.astPrint.length; i++) {
                string += "\"" + this.astPrint[i] + "\"";
                if (i < this.astPrint.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"tokens\": [";
        if (this.tokens !== null) {
            for (let i = 0; i < this.tokens.length; i++) {
                string += this.tokens[i].toJsonString();
                if (i < this.tokens.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"lexerErrors\": [";
        if (this.lexerErrors !== null) {
            for (let i = 0; i < this.lexerErrors.length; i++) {
                string += "\"" + this.lexerErrors[i] + "\"";
                if (i < this.lexerErrors.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"parseErrors\": [";
        if (this.parseErrors !== null) {
            for (let i = 0; i < this.parseErrors.length; i++) {
                string += "\"" + this.parseErrors[i] + "\"";
                if (i < this.parseErrors.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"combinedCheckerErrors\": [";
        if (this.combinedCheckerErrors !== null) {
            for (let i = 0; i < this.combinedCheckerErrors.length; i++) {
                string += "\"" + this.combinedCheckerErrors[i] + "\"";
                if (i < this.combinedCheckerErrors.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "],\n";
        string += "\"varEnv\": ";
        if (this.varEnv !== null) {
            string += this.varEnv.toJsonString();
        }
        else {
            string += "null";
        }
        string += ",\n";
        string += "\"funcEnv\": ";
        if (this.funcEnv !== null) {
            string += this.funcEnv.toJsonString();
        }
        else {
            string += "null";
        }
        string += ",\n";
        string += "\"compilerOutput\": ";
        string += "\"" + this.compilerOutput + "\"";
        string += ",\n";
        string += "\"interpretOutput\": ";
        string += "[";
        if (this.interpretOutput !== null) {
            for (let i = 0; i < this.interpretOutput.length; i++) {
                string += "\"" + this.interpretOutput[i] + "\"";
                if (i < this.interpretOutput.length - 1) {
                    string += ", ";
                }
            }
        }
        string += "]";
        string += "}\n";
        return string;
    }
}

import {calculateViaLanguage} from "../../../public/build/carlCompiler/CaCoDebug.js";

export class TestDeclarations {
    static runTests() {
        console.error("---Running ParseDeclaration tests---");
        this.testDeclaration();
        console.error("---All Tests passed---");
    }

    static testDeclaration() {
        let a = "num i = 100 * 10;" +
            "print i";
        console.log(`   Tested declaration with string ${a}`);
        let value = calculateViaLanguage(a, "compiler");

        console.log(value);
    }
}

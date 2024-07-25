import {calculateViaLanguage} from "../../../public/build/carl/CaDebug.js";

export class TestDeclarations {
    static runTests() {
        console.error("---Running Declaration tests---");
        this.testDeclaration();
        console.error("---All Tests passed---");
    }

    static testDeclaration() {
        let a = "num i = 100* 10";
        console.log(`   Tested declaration with string ${a}`);
        let value = calculateViaLanguage(a);
        console.log(value);
    }
}

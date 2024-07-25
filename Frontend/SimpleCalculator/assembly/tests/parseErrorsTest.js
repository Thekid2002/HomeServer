import assert from "assert";
import {calculateViaLanguage} from "../../../public/build/simpleCalculator/SCDebug.js";

export class ParseErrorsTest {
   static runTests(){
        console.error("---Running ParseErrors tests---");
        for (let i = 0; i < 10; i++) {
            this.testInvalidToken();
            this.testInvalidToken2();
            this.testSinCosTanParseErrors()
        }
        console.error("---ParseErrors Tests passed---");
   }

   static testInvalidToken() {
       let a = (Math.random()-0.5)*10000;
       let calcString = a + "";
       let b = (Math.random()-0.5)*10000;
       calcString += ` + * ${b}`;
       let parseErrors = JSON.parse(calculateViaLanguage(calcString)).parseErrors;
       assert.equal(parseErrors.length, 1);
       console.log(`   Tested parse error with string ${calcString}`)
   }

   static testInvalidToken2() {
       let a = (Math.random()-0.5)*10000;
       let calcString = a + "";
       let b = (Math.random()-0.5)*10000;
       calcString += ` + / ${b}`;
       let parseErrors = JSON.parse(calculateViaLanguage(calcString)).parseErrors;
       assert.equal(parseErrors.length, 1);
       console.log(`   Tested parse error with string ${calcString}`)
   }

   static testSinCosTanParseErrors() {
       let a = (Math.random()-0.5)*10000;
       let b = (Math.random()-0.5)*10000;
       let c = (Math.random()-0.5)*10000;

         let calcString = a + "";
         calcString += `cos(19) + sin( ${a} * ${b} - tan ${c}`;
         let parseErrors = JSON.parse(calculateViaLanguage(calcString)).parseErrors;
         assert.equal(parseErrors.length, 1);
         console.log(`   Tested parse error with string ${calcString}`)
    }


}

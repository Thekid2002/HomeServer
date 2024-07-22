import {calculateViaLanguage} from "../../public/build/debug.js";
import assert from "assert";

export class ExpressionsTest {

    static runTests() {
        console.log("Running Expressions tests");
        for (let i = 0; i < 10; i++) {
            this.testCalculateAddition();
            this.testCalculateSubtraction();
            this.testCalculateMultiplication();
            this.testCalculateDivision();
            this.testCalculateMixed();
        }
        console.log("Tests passed");
    }

    static testCalculateAddition() {
        let amountOfAdditions = Math.round(Math.random()*10);
        let val = (Math.random()-0.5)*10000;
        let calcString = val + "";
        for (let i = 0; i < amountOfAdditions; i++) {
            let a = (Math.random()-0.5)*10000;
            calcString += ` + ${a}`;
            val += a;
        }
        val = Math.round(val*1000)/1000;
        let calcVal = Math.round(JSON.parse(calculateViaLanguage(calcString)).value*1000)/1000;
        assert.strictEqual(calcVal, val);
        console.log(`   Tested ${amountOfAdditions} additions with value ${val} and string ${calcString}`)
    }

    static testCalculateSubtraction() {
        let amountOfSubtractions = Math.round(Math.random()*10);
        let val = (Math.random()-0.5)*10000;
        let calcString = val + "";
        for (let i = 0; i < amountOfSubtractions; i++) {
            let a = (Math.random()-0.5)*10000;
            calcString += ` - ${a}`;
            val -= a;
        }
        val = Math.round(val*1000)/1000;
        let calcVal = Math.round(JSON.parse(calculateViaLanguage(calcString)).value*1000)/1000;
        console.log(`   Tested ${amountOfSubtractions} subtractions with value ${val} and string ${calcString}`)
        assert.strictEqual(calcVal, val);
    }

    static testCalculateMultiplication() {
        let amountOfMultiplications = Math.round(Math.random()*10);
        let val = (Math.random()-0.5)*10000;
        let calcString = val + "";
        for (let i = 0; i < amountOfMultiplications; i++) {
            let a = (Math.random()-0.5)*10000;
            calcString += ` * ${a}`;
            val *= a;
        }
        val = Math.round(val*1000)/1000;
        let calcVal = Math.round(JSON.parse(calculateViaLanguage(calcString)).value*1000)/1000;
        console.log(`   Tested ${amountOfMultiplications} multiplications with value ${val} and string ${calcString}`)
        assert.strictEqual(calcVal, val);
    }

    static testCalculateDivision() {
        let amountOfDivisions = Math.round(Math.random()*10);
        let val = (Math.random()-0.5)*10000;
        let calcString = val + "";
        for (let i = 0; i < amountOfDivisions; i++) {
            let a = (Math.random()-0.5)*10000;
            calcString += ` / ${a}`;
            val /= a;
        }
        val = Math.round(val*1000)/1000;
        let calcVal = Math.round(JSON.parse(calculateViaLanguage(calcString)).value*1000)/1000;
        console.log(`   Tested ${amountOfDivisions} divisions with value ${val} and string ${calcString}`)
        assert.strictEqual(calcVal, val);
    }

    static testCalculateMixed() {
        const amountOfOperations = Math.round(Math.random() * 10);
        const initialValue = (Math.random() - 0.5) * 10000;
        let calcString = initialValue.toString();
        const operations = [];

        for (let i = 0; i < amountOfOperations; i++) {
            const a = (Math.random() - 0.5) * 10000;
            const operator = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
            calcString += ` ${operator} ${a}`;
            operations.push({operator, value: a});
        }

        // Evaluate the expression considering operator precedence
        const evaluateExpression = (initialValue, operations) => {
            let values = [initialValue];
            let operators = [];

            for (const op of operations) {
                if (op.operator === '*' || op.operator === '/') {
                    const lastValue = values.pop();
                    values.push(op.operator === '*' ? lastValue * op.value : lastValue / op.value);
                } else {
                    values.push(op.value);
                    operators.push(op.operator);
                }
            }

            let result = values.shift();
            while (operators.length) {
                const operator = operators.shift();
                const value = values.shift();
                result = operator === '+' ? result + value : result - value;
            }

            return result;
        };

        const expectedValue = Math.round(evaluateExpression(initialValue, operations) * 1000) / 1000;
        const calcVal = Math.round(JSON.parse(calculateViaLanguage(calcString)).value * 1000) / 1000;

        console.log(`Tested ${amountOfOperations} mixed operations with value ${expectedValue} and string ${calcString}`);
        assert.strictEqual(calcVal, expectedValue);
    }
}
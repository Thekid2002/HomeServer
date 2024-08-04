import {Identifier} from "../AST/Nodes/Expressions/Terms/Identifier";

export class LivenessAnalysis {
    currentLiveVars: Array<string>;

    constructor() {
        this.currentLiveVars = new Array<string>();
    }

    pushLiveVar(identifier: Identifier): void {
        if(this.currentLiveVars.includes(identifier.value)) {
            return;
        }
        console.log("Pushing live var: " + identifier.value);
        this.currentLiveVars.push(identifier.value);
    }

    popLiveVar(identifier: Identifier): void {
        let index = this.currentLiveVars.indexOf(identifier.value);
        if(index === -1) {
            return;
        }
        console.log("Popping live var: " + identifier.value);
        this.currentLiveVars.splice(index, 1);
    }
}

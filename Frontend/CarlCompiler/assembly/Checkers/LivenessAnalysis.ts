import {Identifier} from "../AST/Nodes/Expressions/Terms/Identifier";

export class LivenessAnalysis {
    currentLiveVars: Array<string>;

    constructor() {
        this.currentLiveVars = new Array<string>();
    }

    pushLiveVar(identifier: Identifier): void {
        if(this.currentLiveVars.includes(identifier.name)) {
            return;
        }
        console.log("Pushing live var: " + identifier.name);
        this.currentLiveVars.push(identifier.name);
    }

    popLiveVar(identifier: Identifier): void {
        let index = this.currentLiveVars.indexOf(identifier.name);
        if(index === -1) {
            return;
        }
        console.log("Popping live var: " + identifier.name);
        this.currentLiveVars.splice(index, 1);
    }
}

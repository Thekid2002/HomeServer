"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivenessAnalysis = void 0;
class LivenessAnalysis {
    constructor() {
        this.currentLiveVars = [];
    }
    pushLiveVar(identifier) {
        if (this.currentLiveVars.includes(identifier.value)) {
            return;
        }
        console.log("Pushing live var: " + identifier.value);
        this.currentLiveVars.push(identifier.value);
    }
    popLiveVar(identifier) {
        let index = this.currentLiveVars.indexOf(identifier.value);
        if (index === -1) {
            return;
        }
        console.log("Popping live var: " + identifier.value);
        this.currentLiveVars.splice(index, 1);
    }
}
exports.LivenessAnalysis = LivenessAnalysis;

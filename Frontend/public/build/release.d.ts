/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * Frontend/assembly/calculator/calculate
 * @param val1 `f64`
 * @param val2 `f64`
 * @param operator `~lib/string/String`
 * @returns `f64`
 */
export declare function calculate(val1: number, val2: number, operator: string): number;
/**
 * Frontend/assembly/Index/calculateViaLanguage
 * @param string `~lib/string/String`
 * @returns `~lib/string/String`
 */
export declare function calculateViaLanguage(string: string): string;

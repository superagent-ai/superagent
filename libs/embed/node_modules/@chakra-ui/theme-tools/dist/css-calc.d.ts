import { CSSVar } from './css-var.js';

type Operand = string | number | CSSVar;
type Operands = Operand[];
interface CalcChain {
    add: (...operands: Operands) => CalcChain;
    subtract: (...operands: Operands) => CalcChain;
    multiply: (...operands: Operands) => CalcChain;
    divide: (...operands: Operands) => CalcChain;
    negate: () => CalcChain;
    toString: () => string;
}
declare const calc: ((x: Operand) => CalcChain) & {
    add: (...operands: Operands) => string;
    subtract: (...operands: Operands) => string;
    multiply: (...operands: Operands) => string;
    divide: (...operands: Operands) => string;
    negate: (x: Operand) => string;
};

export { CalcChain, Operand, calc };

'use strict';

import * as Bitwise from '../lib/bitwise.js';

export const OP_FNS = {
    and: Bitwise.and,
    or: Bitwise.or,
    xor: Bitwise.xor,
    lshift: Bitwise.lshift,
    rshift: Bitwise.rshift,
};
export class BitwiseExpression {
    constructor(op) {
        this.op = op;
    }

    execute(a, b) {
        const fn = OP_FNS[this.op];
        if (!fn) return [null, new Error(`Unknown operator: ${this.op}`)];
        return fn(a, b);
    }
}

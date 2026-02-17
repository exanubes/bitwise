'use strict';

export class Integer {
    /**@private*/
    constructor(value) {
        this._value = BigInt(value);
    }

    /**
     * @param {string} input
     * @returns {[Integer, Error | null]} integer and error tuple
     */
    static from_binary(input) {
        if (!input) {
            return [new Integer(0), null];
        }

        if (!is_binary(input)) {
            return [new Integer(0), new Error('Expected binary number, received: ', input)];
        }

        let decimal = BigInt(0);
        let index = 0;
        let bit = input.length - 1;
        while (bit >= 0) {
            if (input[index] === '1') {
                decimal += BigInt(2) ** BigInt(bit);
            }

            index += 1;
            bit -= 1;
        }

        return [new Integer(decimal), null];
    }

    /**
     * @param {number | string| bigint} input
     * @returns {[Integer, Error | null]}
     */
    static create(input) {
        const value = typeof input !== 'string' ? String(input) : input;

        if (value.includes('.') || value.includes(',')) {
            return [new Integer(0), new Error('Expected an integer, received: ', value)];
        }

        return [new Integer(value), null];
    }

    decimal() {
        return this._value;
    }
    binary() {
        let current = this._value;
        const quotient = BigInt(2);
        let result = '';

        while (current !== BigInt(0)) {
            result = Number(current % quotient) + result;
            current /= quotient;
        }

        return result || '0';
    }

    is_zero() {
        return this._value === BigInt(0);
    }
}
function is_binary(input) {
    return /^[01]+$/.test(input); //
}

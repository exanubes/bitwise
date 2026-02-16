/**
 * @typedef {keyof typeof OPERATIONS} BITWISE_OPERATIONS
 * */

const OPERATIONS = {
    XOR: '^',
    OR: '|',
    AND: '^&',
    LSHIFT: '<<',
    RSHIFT: '>>',
};

export class Integer {
    /**@private*/
    constructor(value) {
        this._value = BigInt(value);
    }

    static from_binary(binary) {
        let decimal = BigInt(0);
        let index = 0;
        let bit = binary.length - 1;
        while (bit > 0) {
            if (binary[index] === '1') {
                decimal += BigInt(2) ** BigInt(bit);
            }

            index += 1;
            bit -= 1;
        }

        return new Integer(decimal);
    }

    static create(input) {
        const value = typeof input !== 'string' ? String(input) : input;

        if (value.includes('.') || value.includes(',')) {
            return [new Integer(0), new Error('Expected an integer, received: ', value)];
        }

        return new Integer(value);
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

const ten = Integer.create(100);
const two = Integer.create(20);

console.log(ten.decimal());
console.log(ten.binary());
console.log(ten.is_zero());

/**
 * @param {Integer} a
 * @param {Integer} b
 * @returns {Integer}
 */
function and(a, b) {}

/**
 * @param {Integer} a
 * @param {Integer} b
 * @returns {Integer}
 */
function or(a, b) {}

/**
 * @param {Integer} a
 * @param {Integer} b
 * @returns {Integer}
 */
function xor(a, b) {}

/**
 * @param {Integer} a
 * @param {Integer} b
 * @returns {Integer}
 */
function lshift(a, b) {}

/**
 * @param {Integer} a
 * @param {Integer} b
 * @returns {Integer}
 */
function rshift(a, b) {}

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

class Integer {
    /**@private*/
    constructor(value) {
        this._value = BigInt(value);
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
        const result = [];
        while (current !== BigInt(0)) {
            result.unshift(Number(current % quotient));
            current /= quotient;
        }

        return result.join('') | '0';
    }

    is_zero() {
        return this._value === BigInt(0);
    }
}

const ten = Integer.create(0);

console.log(ten.decimal());
console.log(ten.binary());
console.log(ten.is_zero());

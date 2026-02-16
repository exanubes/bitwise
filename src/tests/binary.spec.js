import { test, describe, expect } from 'bun:test';
import { Integer } from '../lib/integer';
import * as Bitwise from '../lib/bitwise';

describe('bitwise.and', () => {
    const tests = [
        {
            a: 10,
            b: 2,
            expected: { decimal: 2n, binary: '10', err: null },
        },

        {
            a: 100,
            b: 20,
            expected: { decimal: 4n, binary: '100', err: null },
        },

        {
            a: 234103421,
            b: 12318,
            expected: { decimal: 8220n, binary: '10000000011100', err: null },
        },

        {
            a: 890271318724390428492n,
            b: 902349129491238914011n,
            expected: {
                decimal: 890243444438017771336n,
                binary: '1100000100001010011100000100000000000100100100010000000000011101001000',
                err: null,
            },
        },
    ];

    tests.forEach((t) => {
        test(`${t.a} & ${t.b}`, () => {
            const [a] = Integer.create(t.a);
            const [b] = Integer.create(t.b);

            const [result, err] = Bitwise.and(a, b);

            expect(err).toBe(t.expected.err);
            expect(result.decimal()).toBe(t.expected.decimal);
            expect(result.binary()).toBe(t.expected.binary);
        });
    });
});

describe('bitwise.or', () => {
    const tests = [
        {
            a: 10,
            b: 2,
            expected: { decimal: 10n, binary: '1010', err: null },
        },

        {
            a: 100,
            b: 20,
            expected: { decimal: 116n, binary: '1110100', err: null },
        },

        {
            a: 234103421n,
            b: 12318n,
            expected: { decimal: 234107519n, binary: '1101111101000011001001111111', err: null },
        },

        {
            a: 890271318724390428492n,
            b: 902349129491238914011n,
            expected: {
                decimal: 902377003777611571167n,
                binary: '1100001110101011111111000111111110111111111101110111001001111111011111',
                err: null,
            },
        },
    ];

    tests.forEach((t) => {
        test(`${t.a} | ${t.b}`, () => {
            const [a] = Integer.create(t.a);
            const [b] = Integer.create(t.b);

            const [result, err] = Bitwise.or(a, b);

            expect(err).toBe(t.expected.err);
            expect(result.decimal()).toBe(t.expected.decimal);
            expect(result.binary()).toBe(t.expected.binary);
        });
    });
});

describe('bitwise.xor', () => {
    const tests = [
        {
            a: 10,
            b: 2,
            expected: { decimal: 8n, binary: '1000', err: null },
        },

        {
            a: 100,
            b: 20,
            expected: { decimal: 112n, binary: '1110000', err: null },
        },

        {
            a: 234103421n,
            b: 12318n,
            expected: { decimal: 234099299n, binary: '1101111101000001001001100011', err: null },
        },

        {
            a: 890271318724390428492n,
            b: 902349129491238914011n,
            expected: {
                decimal: 12133559339593799831n,
                binary: '1010100001100011000011111110111011011001100111001001100010010111',
                err: null,
            },
        },
    ];

    tests.forEach((t) => {
        test(`${t.a} ^ ${t.b}`, () => {
            const [a] = Integer.create(t.a);
            const [b] = Integer.create(t.b);

            const [result, err] = Bitwise.xor(a, b);

            expect(err).toBe(t.expected.err);
            expect(result.decimal()).toBe(t.expected.decimal);
            expect(result.binary()).toBe(t.expected.binary);
        });
    });
});

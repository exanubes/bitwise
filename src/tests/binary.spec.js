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

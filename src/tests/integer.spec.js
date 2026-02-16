import { Integer } from '../lib/integer';
import { test, expect, describe } from 'bun:test';

describe('integer', () => {
    const tests = [
        { decimal: 10, binary: '1010', err: null },
        { decimal: '1010', binary: '1111110010', err: null },
        {
            decimal: '890271318724390',
            binary: '11001010011011001001110001101101001100111100100110',
            err: null,
        },
        {
            decimal: '890271318724390428',
            binary: '110001011010111000010000110000101010010010010010111000011100',
            err: null,
        },
        {
            decimal: '890271318724390428492',
            binary: '1100000100001011111111000101111000010100101101110111000001111101001100',
            err: null,
        },
    ];

    for (const t of tests) {
        test(`integer.create(${t.decimal})`, () => {
            const [integer, err] = Integer.create(t.decimal);
            expect(integer.binary()).toBe(t.binary);
            expect(err).toBe(t.err);
        });
    }

    for (const t of tests) {
        test(`integer.from_binary(${t.binary})`, () => {
            const [integer, err] = Integer.from_binary(t.binary);
            expect(integer.decimal()).toBe(BigInt(t.decimal));
            expect(err).toBe(t.err);
        });
    }
});

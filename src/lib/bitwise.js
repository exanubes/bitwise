'use strict';

import { Integer } from './integer.js';

/**
 * @typedef {keyof typeof OPERATIONS} BITWISE_OPERATIONS
 * */

/**
 * @typedef {import("./integer").Integer} Integer
 */

const OPERATIONS = {
    XOR: '^',
    OR: '|',
    AND: '^&',
    LSHIFT: '<<',
    RSHIFT: '>>',
};

/**
 * @param {Integer} a
 * @param {Integer} b
 * @returns {[Integer, Error | null]}
 */
export function and(_a, _b) {
    const [a, b] = normalize_binary(_a.binary(), _b.binary());
    let result = '';
    for (let index = 0; index < a.length; index += 1) {
        if (a[index] === '1' && b[index] === '1') {
            result += '1';
        } else {
            result += '0';
        }
    }

    return Integer.from_binary(result);
}

/**
 * @param {Integer} a
 * @param {Integer} b
 * @returns {[Integer, Error | null]}
 */
export function or(_a, _b) {
    const [a, b] = normalize_binary(_a.binary(), _b.binary());
    let result = '';

    for (let index = 0; index < a.length; index += 1) {
        if (a[index] === '1' || b[index] === '1') {
            result += '1';
        } else {
            result += '0';
        }
    }

    return Integer.from_binary(result);
}

/**
 * @param {Integer} _a
 * @param {Integer} _b
 * @returns {[Integer, Error | null]}
 */
export function xor(_a, _b) {
    const [a, b] = normalize_binary(_a.binary(), _b.binary());
    let result = '';

    for (let index = 0; index < a.length; index += 1) {
        if ((a[index] === '1' && b[index] === '0') || (a[index] === '0' && b[index] === '1')) {
            result += '1';
        } else {
            result += '0';
        }
    }

    return Integer.from_binary(result);
}

/**
 * @param {Integer} a
 * @param {Integer} b
 * @returns {[Integer, Error | null]}
 */
function lshift(a, b) {}

/**
 * @param {Integer} a
 * @param {Integer} b
 * @returns {[Integer, Error | null]}
 */
function rshift(a, b) {}

/**
 * @param {string} a
 * @param {string} b
 * @returns {[string, string]}
 */
export function normalize_binary(a, b) {
    if (a.length === b.length) {
        return [a, b];
    }

    if (a.length > b.length) {
        b = b.padStart(a.length, '0');
    } else {
        a = a.padStart(b.length, '0');
    }

    return [a, b];
}

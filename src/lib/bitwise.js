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
 * @returns {Integer}
 */
export function and(_a, _b) {}

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

'use strict';

import { Integer } from '../lib/integer';

export function parse_binary_input(input) {
    return input.replace(/\s+/g, '');
}

export function format_binary(input) {
    if (!input || input === '0') return '0000';
    const padded = input.padStart(Math.ceil(input.length / 4) * 4, '0');
    return padded.replace(/(.{4})(?=.)/g, '$1 ');
}

export class OperandValue {
    static from_decimal(input) {
        return Integer.create(input || '0');
    }

    static from_binary(input) {
        return Integer.from_binary(parse_binary_input(input) || '0');
    }
}

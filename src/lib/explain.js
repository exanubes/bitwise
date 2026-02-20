'use strict';

import { normalize_binary } from './bitwise.js';
import { format_binary } from './operand.js';

/**
 * @typedef {'normal'|'gained'|'lost'|'lost-struck'} bit_effect
 */

/**
 * @typedef {Object} bit_cell
 * @property {'0'|'1'} value
 * @property {bit_effect} effect
 */

/**
 * @typedef {Object} explanation_model
 * @property {string} title
 * @property {string=} label
 * @property {bit_cell[][]} rows
 * @property {string} operator_name
 */

/**
 * @param {string} operator_name
 * @param {*} left_operand
 * @param {*} right_operand
 * @param {*} computation_result
 * @returns {explanation_model}
 */
function explain_bitwise(operator_name, left_operand, right_operand, computation_result) {
    const normalized = normalize_binary(left_operand.binary(), right_operand.binary());

    const left_binary = normalized[0];
    const right_binary = normalized[1];
    const result_binary = computation_result.binary().padStart(left_binary.length, '0');

    return {
        operator_name,
        title: 'Bitwise ' + operator_name.toUpperCase(),
        rows: [
            build_bit_cells(left_binary),
            build_bit_cells(right_binary),
            build_result_cells(left_binary, right_binary, result_binary),
        ],
    };
}

/**
 * @param {'lshift'|'rshift'} shift_operator
 * @param {*} left_operand
 * @param {*} right_operand
 * @param {*} computation_result
 * @returns {explanation_model}
 */
function explain_shift(shift_operator, left_operand, right_operand, computation_result) {
    const shift_amount = Number(right_operand.decimal());
    const direction = shift_operator === 'lshift' ? 'left' : 'right';

    const original_binary = left_operand.binary();
    const result_binary = computation_result.binary();

    return {
        title: 'Bitwise ' + shift_operator.toUpperCase(),
        label:
            format_binary(original_binary) +
            ' — shift ' +
            shift_amount +
            ' bit' +
            (shift_amount === 1 ? '' : 's') +
            ' to the ' +
            direction,
        rows: [build_shift_cells(shift_operator, original_binary, result_binary, shift_amount)],
        operator_name: shift_operator,
    };
}

function build_bit_cells(binary_string) {
    return binary_string.split('').map(function (bit) {
        return { value: bit, effect: 'normal' };
    });
}

function build_result_cells(left_binary, right_binary, result_binary) {
    return result_binary.split('').map(function (result_bit, index) {
        const left_bit = left_binary[index];
        const right_bit = right_binary[index];

        if (result_bit === '1') {
            return { value: result_bit, effect: 'gained' };
        }

        if (result_bit === '0' && (left_bit === '1' || right_bit === '1')) {
            return { value: result_bit, effect: 'lost' };
        }

        return { value: result_bit, effect: 'normal' };
    });
}

function build_shift_cells(shift_operator, original_binary, result_binary, shift_amount) {
    if (shift_amount === 0) {
        return build_bit_cells(result_binary);
    }

    if (shift_operator === 'lshift') {
        const length = result_binary.length;
        return result_binary.split('').map(function (bit, index) {
            return {
                value: bit,
                effect: index >= length - shift_amount ? 'gained' : 'normal',
            };
        });
    }

    // NOTE: right shift
    if (shift_amount >= original_binary.length) {
        return [{ value: '0', effect: 'normal' }].concat(
            original_binary.split('').map(function (bit) {
                return {
                    value: bit,
                    effect: 'lost-struck',
                };
            })
        );
    }

    const length = original_binary.length;
    return format_binary(original_binary)
        .replace(/\s/g, '')
        .split('')
        .map(function (bit, index) {
            return {
                value: bit,
                effect: index >= length - shift_amount ? 'lost-struck' : 'normal',
            };
        });
}

const explanation_registry = {
    and: explain_bitwise,
    or: explain_bitwise,
    xor: explain_bitwise,
    lshift: explain_shift,
    rshift: explain_shift,
};

export function resolve_explanation_function(operator_name) {
    const fn = explanation_registry[operator_name];

    if (!fn) {
        throw new Error('Unsupported operator: ' + operator_name);
    }

    return fn;
}

const operator_name_description = Object.freeze({
    and: 'Sets each bit to 1 only if the corresponding bits in both operands are 1.',
    or: 'Sets each bit to 1 if at least one of the corresponding bits is 1.',
    xor: 'Sets each bit to 1 if the corresponding bits differ.',
    lshift: 'Shifts all bits left by x positions, filling with 0s on the right.',
    rshift: 'Shifts all bits right by x positions, dropping the right-most bits.',
});

export function render_explanation(model) {
    const dialog = document.createElement('dialog');
    dialog.className = 'expr-explanation-dialog';

    const heading = document.createElement('h2');
    heading.textContent = model.title;

    const description = document.createElement('p');
    description.innerText = operator_name_description[model.operator_name];

    dialog.append(heading, description);
    if (model.label) {
        const label = document.createElement('div');
        label.className = 'expr-explanation__shift-label';
        label.textContent = model.label;
        dialog.appendChild(label);
    }

    model.rows.forEach(function (row, index) {
        if (index === 2) {
            const divider = document.createElement('div');
            divider.className = 'expr-explanation__divider';
            dialog.appendChild(divider);
        }

        const row_element = document.createElement('div');
        row_element.className = 'expr-explanation__row';

        row.forEach(function (cell) {
            const span = document.createElement('span');
            span.className = 'bit ' + effect_to_class(cell.effect);
            span.textContent = cell.value;
            row_element.appendChild(span);
        });

        dialog.appendChild(row_element);
    });

    const close_button = document.createElement('button');
    close_button.classList.add('expr-explanation__close');
    close_button.textContent = 'OK';
    close_button.addEventListener('click', function () {
        dialog.close();
    });

    dialog.appendChild(close_button);

    dialog.addEventListener('close', function () {
        dialog.remove();
    });

    return dialog;
}

function effect_to_class(effect) {
    switch (effect) {
        case 'gained':
            return 'bit--gained';
        case 'lost':
            return 'bit--lost';
        case 'lost-struck':
            return 'bit--lost bit--strikethrough';
        default:
            return '';
    }
}

/******************************************************************
 * UI — CLEAN AND SMALL
 ******************************************************************/

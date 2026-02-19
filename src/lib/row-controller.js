'use strict';

import { BitwiseExpression } from './bitwise-expression';
import { format_binary, OperandValue } from './operand';

export const OPERANDS = {
    LEFT: 'left',
    RIGHT: 'right',
};

export const INPUT_TYPE = {
    BINARY: 'binary',
    DECIMAL: 'decimal',
};

export class RowController {
    /**@type {Record<string, import('./integer').Integer>}*/ last_computation;
    constructor({ on_result, on_error, on_operand_sync }) {
        this.operator = 'and';
        this.result = null;
        this.last_computation = null;

        this.operands = {
            [OPERANDS.LEFT]: { mode: INPUT_TYPE.DECIMAL, decimal: '0', binary: '0000' },
            [OPERANDS.RIGHT]: { mode: INPUT_TYPE.DECIMAL, decimal: '0', binary: '0000' },
        };

        this.on_result = on_result;
        this.on_error = on_error;
        this.on_operand_sync = on_operand_sync;
    }

    set_operator(op) {
        this.operator = op;
    }

    set_operand_value(side, value) {
        const operand = this.operands[side];

        if (operand.mode === INPUT_TYPE.DECIMAL) {
            operand.decimal = value;
        } else {
            operand.binary = value;
        }

        this.sync_operand(side);
    }

    toggle_mode(side) {
        const op = this.operands[side];

        this.sync_operand(side);
        op.mode = op.mode === INPUT_TYPE.DECIMAL ? INPUT_TYPE.BINARY : INPUT_TYPE.DECIMAL;

        this.on_operand_sync(side, op);
    }

    fill_operand(side, int) {
        const op = this.operands[side];
        op.decimal = int.decimal().toString();
        op.binary = format_binary(int.binary());

        this.on_operand_sync(side, op);
    }

    read_operand(side) {
        const op = this.operands[side];

        if (op.mode === INPUT_TYPE.DECIMAL) {
            return OperandValue.from_decimal(op.decimal.trim());
        }

        return OperandValue.from_binary(op.binary.trim());
    }

    sync_operand(side) {
        const op = this.operands[side];

        if (op.mode === INPUT_TYPE.DECIMAL) {
            const [int, err] = OperandValue.from_decimal(op.decimal);

            if (!err) {
                op.binary = format_binary(int.binary());
                this.on_operand_sync(side, op);
            }
        } else {
            const [int, err] = OperandValue.from_binary(op.binary);

            if (!err) {
                op.decimal = int.decimal().toString();
                this.on_operand_sync(side, op);
            }
        }
    }

    compute() {
        const [a, err_a] = this.read_operand(OPERANDS.LEFT);
        const [b, err_b] = this.read_operand(OPERANDS.RIGHT);

        if (err_a || err_b) {
            this.result = null;
            this.on_error((err_a || err_b).message);
            return;
        }

        const expr = new BitwiseExpression(this.operator);
        const [result, err] = expr.execute(a, b);

        console.log({ result, err });
        if (err) {
            this.result = null;
            this.on_error(err.message);
            return;
        }

        this.result = result;
        this.last_computation = { a, b };

        this.on_result({
            decimal: result.decimal().toString(),
            binary: format_binary(result.binary()),
        });
    }
}

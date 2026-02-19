import { INPUT_TYPE, OPERANDS, RowController } from './row-controller';
import { normalize_binary } from './bitwise';
import { format_binary } from './operand';
import { render_explanation, resolve_explanation_function } from './explain';

const ROW_TEMPLATE = `
<div class="expr-row__inputs">
    <div class="expr-row__operand">
        <div class="expr-row__decimal">
            <input type="text" placeholder="Decimal" inputmode="numeric" />
        </div>
        <button type="button" class="expr-row__swap-btn" data-side="a" title="Swap input mode">&#8693;</button>
        <div class="expr-row__binary">
            <input type="text" placeholder="Binary" readonly disabled />
        </div>
    </div>

    <div class="expr-row__operator">
        <select>
            <option value="and">AND</option>
            <option value="or">OR</option>
            <option value="xor">XOR</option>
            <option value="lshift">LSHIFT</option>
            <option value="rshift">RSHIFT</option>
        </select>
    </div>

    <div class="expr-row__operand">
        <div class="expr-row__decimal">
            <input type="text" placeholder="Decimal" inputmode="numeric" />
        </div>
        <button type="button" class="expr-row__swap-btn" data-side="b" title="Swap input mode">&#8693;</button>
        <div class="expr-row__binary">
            <input type="text" placeholder="Binary" readonly disabled/>
        </div>
    </div>

    <button type="button" class="expr-row__equals">=</button>
</div>

<div class="expr-row__result">
    <div class="expr-row__result-decimal-container">
        <span class="expr-row__result-decimal"></span>
        <button type="button" class="expr-row__explain">Explain</button>
    </div>
    <span class="expr-row__result-binary"></span>
</div>

<div class="expr-row__error"></div>
`;

function cache_dom(root) {
    const operands = root.querySelectorAll('.expr-row__operand');

    const cache_operand = (el) => ({
        decimal: el.querySelector('.expr-row__decimal input'),
        binary: el.querySelector('.expr-row__binary input'),
        swap: el.querySelector('.expr-row__swap-btn'),
    });

    return {
        operands: {
            [OPERANDS.LEFT]: cache_operand(operands[0]),
            [OPERANDS.RIGHT]: cache_operand(operands[1]),
        },
        operator: root.querySelector('.expr-row__operator select'),
        equals: root.querySelector('.expr-row__equals'),
        result: root.querySelector('.expr-row__result'),
        result_decimal: root.querySelector('.expr-row__result-decimal'),
        result_binary: root.querySelector('.expr-row__result-binary'),
        explain_btn: root.querySelector('.expr-row__explain'),
        error: root.querySelector('.expr-row__error'),
    };
}

export function create_row_adapter(prefill = null) {
    const row = document.createElement('div');
    row.className = 'expr-row';
    row.innerHTML = ROW_TEMPLATE;

    const dom = cache_dom(row);

    const controller = new RowController({
        on_result: render_result,
        on_error: render_error,
        on_operand_sync: render_operand,
    });

    function render_result(data) {
        dom.error.classList.remove('expr-row__error--visible');
        dom.result.classList.add('expr-row__result--visible');

        dom.result_decimal.textContent = data.decimal;
        dom.result_binary.textContent = data.binary;
    }

    function render_error(msg) {
        dom.error.textContent = msg;
        dom.error.classList.add('expr-row__error--visible');
        dom.result.classList.remove('expr-row__result--visible');
    }

    function render_operand(side, operator) {
        const operand = dom.operands[side];

        operand.decimal.value = operator.decimal;
        operand.binary.value = operator.binary;

        const is_decimal = operator.mode === INPUT_TYPE.DECIMAL;

        operand.decimal.toggleAttribute('readonly', !is_decimal);
        operand.decimal.toggleAttribute('disabled', !is_decimal);

        operand.binary.toggleAttribute('readonly', is_decimal);
        operand.binary.toggleAttribute('disabled', is_decimal);
    }

    for (const side of Object.values(OPERANDS)) {
        const d = dom.operands[side];

        d.swap.addEventListener('click', () => {
            controller.toggle_mode(side);
        });

        d.decimal.addEventListener('input', () => {
            controller.set_operand_value(side, d.decimal.value);
        });

        d.binary.addEventListener('input', () => {
            controller.set_operand_value(side, d.binary.value);
        });
    }

    dom.operator.addEventListener('change', () => {
        controller.set_operator(dom.operator.value);
    });

    dom.equals.addEventListener('click', () => {
        controller.compute();
    });

    dom.explain_btn.addEventListener('click', function () {
        const last_computation = controller.last_computation;

        const computation_result = controller.result;

        if (!last_computation || !computation_result) {
            return;
        }

        const left_operand = last_computation.a;

        const right_operand = last_computation.b;

        const operator_name = controller.operator;
        const explain_function = resolve_explanation_function(operator_name);

        const model = explain_function(
            operator_name,
            left_operand,
            right_operand,
            computation_result
        );

        const dialog = render_explanation(model);

        dom.result.closest('.expr-row').appendChild(dialog);

        dialog.showModal();
    });

    if (prefill) {
        controller.fill_operand(OPERANDS.LEFT, prefill);
    } else {
        controller.sync_operand(OPERANDS.LEFT);
        controller.sync_operand(OPERANDS.LEFT);
    }

    return {
        el: row,
        controller,
    };
}

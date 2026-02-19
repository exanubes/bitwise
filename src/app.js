'use strict';

import { create_row_adapter } from './lib/dom';

const rows = [];

const container = document.getElementById('rows');

function add_row(prefill = null) {
    const row = create_row_adapter(prefill);
    rows.push(row);
    container.appendChild(row.el);
}

add_row(null);

document.getElementById('add-row-btn').addEventListener('click', () => {
    const prev = rows[rows.length - 1];
    add_row(prev?.controller.result ?? null);
});

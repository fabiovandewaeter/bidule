// ui/views/logs_view.js
// @ts-check

import '../../utils/types.js'
import { EB } from '../core/runtime.js';

const MAX_RENDERED_LOGS = 10;

/**
 * @param {World} world 
 * @param {UIState} ui_state 
 * @returns {string}
 */
export function render(world, ui_state) {
    const res = `
    <div class="logs-view">
        <h1>Logs</h1>
        <ul class="logs-list"></ul>
    </div>
    `;

    EB.on('logs', () => update_all(world, ui_state));

    return res;
}

/**
 * @param {World} world 
 * @param {UIState} ui_state 
 */
export function update_all(world, ui_state) {
    document.querySelectorAll('ul.logs-list').forEach(
        log_list => {
            const logs_to_add = ui_state.logs.slice(ui_state.logs.length);
            logs_to_add.forEach(log => {
                const li = document.createElement('li');
                li.textContent = log;
                log_list.appendChild(li);
            })

            const rendered_logs = log_list.children.length;
            if (rendered_logs > MAX_RENDERED_LOGS) {
                const to_remove = rendered_logs - MAX_RENDERED_LOGS;
                for (let i = 0; i < to_remove; i++) {
                    const first = log_list.firstChild;
                    if (first === null) throw new Error();
                    log_list.removeChild(first);
                }
            }
        }
    );
}

// ui/components/logs_comp.js
// @ts-check

import '../../utils/types.js'
import { EB } from '../../utils/event_bus.js';
import * as Store from '../core/store.js'

const MAX_RENDERED_LOGS = 10;

/**
 * @returns {string}
 */
export function render() {
    return `
    <div class="logs-comp">
        <h1>Logs</h1>
        <ul class="logs-list"></ul>
    </div>
    `;
}

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: () => void }}
 */
export function mount(container) {
    const el = document.createElement('div');
    el.innerHTML = render();

    const update = () => {
        const s = Store.get_store();
        const list = el.querySelector('#log-list');
        if (!list) return;
        list.innerHTML = s.ui_state.logs
            .slice(-10)
            .map(log => `<li>${log}</li>`)
            .join('');
    };

    const off = EB.on('logs', update);
    update();

    const destroy = () => {
        off();
        el.remove();
    };

    container.appendChild(el);
    return { element: el, destroy };
}

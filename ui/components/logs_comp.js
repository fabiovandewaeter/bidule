// ui/components/logs_comp.js
// @ts-check

import '../../utils/types.js'
import * as SB from '../../utils/signal_bus.js'
import * as UISB from '../core/signals.js'
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
        const s = Store.get();
        const list = el.querySelector('.logs-list');
        if (!list) return;
        list.innerHTML = s.ui_state.logs
            .slice(-MAX_RENDERED_LOGS)
            .map(log => `<li>${log}</li>`)
            .join('');
    };

    const off = SB.on(UISB.BUS, 'logs', update);
    // TODO: les components ne doivent pas se toggle eux meme
    // const off_toggle = SB.on(UISB.BUS, 'toggle_logs', () => {
    //     el.classList.toggle('hidden');
    // });
    update();

    const destroy = () => {
        off();
        // off_toggle();
        el.remove();
    };

    container.appendChild(el);
    return { element: el, destroy };
}

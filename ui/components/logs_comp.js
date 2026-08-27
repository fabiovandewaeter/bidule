// ui/components/logs_comp.js
// @ts-check

import '../../utils/types.js'
import * as SB from '../../utils/signal_bus.js'
import * as UISB from '../core/signals.js'
import * as Store from '../core/store.js'
import * as Comp from './comp.js'
/**
 * @typedef {import('./comp.js').DestroyFunction} DestroyFunction
 */

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
 * @returns {{element: HTMLElement, destroy: DestroyFunction }}
 */
export function mount(container) {
    return Comp.create_comp(container, (el, add_cleanup) => {
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

        add_cleanup(SB.on(UISB.BUS, 'logs', update));
        // TODO: NE PAS METTRE CAR les components ne doivent pas se toggle eux meme ça se fait dans menu_comp.js
        // const off_toggle = SB.on(UISB.BUS, 'toggle_logs', () => {
        //     el.classList.toggle('hidden');
        // });
        update();
    });
}

// ui/components/menu_comp.js
// @ts-check

import '../../utils/types.js'
import * as Store from '../core/store.js'
import * as UIState from '../core/ui_state.js'
import * as Time from './time_comp.js'
import * as Comp from './comp.js'
import * as SCM from './sub_comp_manager.js'

/**@type {SubCompKey} */
const TIME_KEY = 'time';

/**
 * @returns {string}
 */
export function render() {
    return `
    <div class="menu-comp">
        <button data-action="toggle_time" data-spawn="true">Spawn time</button>
    </div>
    `;
}

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: () => void }}
 */
export function mount(container) {
    return Comp.create_comp_with_sub_comps(container, (el, sub_comp_manager, add_cleanup) => {
        el.innerHTML = render();

        add_cleanup(Comp.delegate_click(el, (action, event, btn) => {
            handle_action(action, btn, sub_comp_manager, el);
        }));
    });
}

/**
 * @param {string} action
 * @param {HTMLElement} btn
 * @param {SubCompManager} sub_comp_manager
 * @param {HTMLElement} el
 */
function handle_action(action, btn, sub_comp_manager, el) {
    const s = Store.get();
    switch (action) {
        case 'toggle_time': {
            const visible = SCM.mount_or_toggle(sub_comp_manager, TIME_KEY, () => Time.mount(el));
            btn.textContent = visible ? "Hide time" : "Spawn time";
            UIState.add_log(s.ui_state, 'toggle_time');
            break;
        }
    }
}

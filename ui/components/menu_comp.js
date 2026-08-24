// ui/components/menu_comp.js
// @ts-check

import '../../utils/types.js'
import * as Store from '../core/store.js'
import * as UIState from '../core/ui_state.js'
import * as Time from './time_comp.js'
import * as Comp from './comp.js'
import * as CCM from './child_comp_manager.js'

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
    return Comp.create_comp_with_children(container, (el, child_comp_manager) => {
        el.innerHTML = render();

        const off_click = Comp.delegate_click(el, {
            toggle_time: (event, btn) => {
                const s = Store.get();
                const visible = CCM.toggle_child(child_comp_manager, 'time', () => Time.mount(el));
                btn.textContent = visible ? "Hide time" : "Spawn time";
                UIState.add_log(s.ui_state, 'toggle_time');
            }
        });

        return off_click;
    });
}

// ui/components/menu_comp.js
// @ts-check

import '../../utils/types.js'
import * as Store from '../core/store.js'
import * as UIState from '../core/ui_state.js'
import * as Time from './time_comp.js'
import * as Comp from './comp.js'

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
    return Comp.create_comp(container, (el) => {
        el.innerHTML = render();
        const children = Comp.create_child_manager();

        const off_click = Comp.delegate_click(el, {
            toggle_time: (event, btn) => {
                const s = Store.get_store();
                if (btn.dataset.spawn == "true") {
                    const child = Time.mount(el);
                    children.add(child);
                    btn.dataset.spawn = "false";
                    btn.textContent = "Hide time";
                } else {
                    children.remove_last();

                    btn.dataset.spawn = "true";
                    btn.textContent = "Spawn time";
                }
                UIState.add_log(s.ui_state, 'toggle_time');
            }
        });

        return () => {
            off_click();
            children.destroy_all();
        }
    });
}

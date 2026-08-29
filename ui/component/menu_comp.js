// ui/component/menu_comp.js
// @ts-check

/**
 * @typedef {import("./comp.js").DestroyFunction} DestroyFunction
 * @typedef {import("./sub_comp_manager.js").SubCompKey} SubCompKey
 * @typedef {import("./sub_comp_manager.js").SubCompManager} SubCompManager
 */
import "../../utils/types.js"
import * as StoreM from "../core/store.js"
import * as UIStateM from "../core/ui_state.js"
import * as TimeCM from "./time_comp.js"
import * as CompM from "./comp.js"
import * as SCMM from "./sub_comp_manager.js"

/**@type {SubCompKey} */
const TIME_KEY = "time";

const ACTIONS = Object.freeze(/**@type {const}*/({
    TOGGLE_TIME: "toggle_time",
}));
/**@typedef {EnumValue<typeof ACTIONS>} Action*/

/**
 * @returns {string}
 */
export function render() {
    return `
<button data-action="${ACTIONS.TOGGLE_TIME}" data-spawn="true">Spawn time</button>
    `;
}

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: DestroyFunction}}
 */
export function mount(container) {
    return CompM.create_comp_with_sub_comps(container, "menu-comp", (el, sub_comp_manager, add_cleanup) => {
        el.innerHTML = render();

        add_cleanup(CompM.delegate_click_with_enum(el, ACTIONS, (action, event, btn) => {
            handle_action(action, btn, sub_comp_manager, el);
        }));
    });
}

/**
 * @param {Action} action
 * @param {HTMLElement} btn
 * @param {SubCompManager} sub_comp_manager
 * @param {HTMLElement} el
 */
function handle_action(action, btn, sub_comp_manager, el) {
    const s = StoreM.get();
    switch (action) {
        case ACTIONS.TOGGLE_TIME: {
            const visible = SCMM.mount_or_toggle(sub_comp_manager, TIME_KEY, () => TimeCM.mount(el));
            btn.textContent = visible ? "Hide time" : "Spawn time";
            UIStateM.add_log(s.ui_state, "toggle_time");
            break;
        }
        default: throw new Error(action);
    }
}

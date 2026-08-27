// ui/scenes/menu_scene.js
// @ts-check

/**
 * @typedef {import('../components/comp.js').DestroyFunction} DestroyFunction
 */
import '../../utils/types.js'
import * as SceneM from './scene.js'
import * as UIStateM from '../core/ui_state.js'
import * as StoreM from '../core/store.js'
import * as UISBM from '../core/signals.js'
import * as SBM from '../../utils/signal_bus.js'
import * as UtilsM from '../../utils/utils.js'
import * as CompM from '../components/comp.js'

const ACTIONS = Object.freeze({
    SWITCH_SCENE: 'switch_scene',
});
/**@typedef {EnumValue<typeof ACTIONS>} Action*/

/**
 * @returns {string}
 */
function render() {
    return `
<h1>Scene: Menu</h1>
<div id="controls">
    <button data-action=${ACTIONS.SWITCH_SCENE} data-scene="main">Switch to main</button>
</div>
    `;
}

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: DestroyFunction }}
 */
export function mount(container) {
    return CompM.create_comp_with_sub_comps(container, 'scene-menu', (el, sub_comps, add_cleanup) => {
        el.innerHTML = render();

        add_cleanup(CompM.delegate_click_with_enum(el, ACTIONS, (action, event, btn) => {
            handle_action(action, btn);
        }));
    });
}

/**
 * @param {Action} action
 * @param {HTMLElement} btn
 */
function handle_action(action, btn) {
    const s = StoreM.get();
    switch (action) {
        case ACTIONS.SWITCH_SCENE: {
            const s = StoreM.get();
            const new_scene = btn.dataset.scene;
            if (new_scene) {
                if (!UtilsM.is_enum_value(SceneM.SCENES, new_scene)) throw new Error();
                s.ui_state.scene = new_scene;
                UIStateM.add_log(s.ui_state, `switch_scene: ${new_scene}`);
                SBM.emit(UISBM.BUS, 'scene_switched', new_scene);
            }
            break;
        }
        default: throw new Error(action);
    }
}

// ui/scenes/menu_scene.js
// @ts-check

import '../../utils/types.js';
import * as Scene from './scene.js'
import * as UIState from '../core/ui_state.js'
import * as Store from '../core/store.js'
import { EB } from '../../utils/event_bus.js';

/**
 * @returns {string}
 */
function render() {
    return `
    <h1>Scene: Menu</h1>
    <div id="controls">
        <button data-action="switch_scene" data-scene="main">Switch to main</button>
    </div>
    `;
}

/**
 * @param {HTMLElement} container 
 * @returns { () => void }
 */
export function mount(container) {
    const el = document.createElement('div');
    el.innerHTML = render();

    // @ts-ignore
    const on_switch_scene = (element) => {
        const s = Store.get_store();
        const new_scene = element.currentTarget.dataset.scene;
        if (new_scene) {
            // UIState.set_scene(new_scene);
            if (!Scene.is_valid_scene(new_scene)) { throw new Error(`Invalid scene: ${new_scene}`); }
            s.ui_state.scene = new_scene;
            UIState.add_log(s.ui_state, `switch_scene: ${new_scene}`);
            // Scene.unregister_actions(ACTIONS);
            EB.emit('scene_switched', new_scene);
        }
    }
    const switch_scene_btn = el.querySelector('button[data-action="switch_scene"]');
    switch_scene_btn?.addEventListener('click', on_switch_scene);

    const destroy = () => {
        el.remove();
    };
    container.appendChild(el);
    return destroy;
}

/** @type {Action[]} */
const ACTIONS = [
    {
        // @ts-ignore
        name: 'switch_scene', handler: ({ element }) => {
            const new_scene = element.dataset.scene;
            if (new_scene) {
                const s = Store.get_store();
                // UIState.set_scene(new_scene);
                if (!Scene.is_valid_scene(new_scene)) { throw new Error(`Invalid scene: ${new_scene}`); }
                s.ui_state.scene = new_scene;
                UIState.add_log(s.ui_state, `switch_scene: ${new_scene}`);
                Scene.unregister_actions(ACTIONS);
                EB.emit('scene_switched', new_scene);
            }
        }
    },
];

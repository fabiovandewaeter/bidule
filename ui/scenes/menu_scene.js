// ui/scenes/menu_scene.js
// @ts-check

import '../../utils/types.js';
import { EB, UI_STATE } from '../core/runtime.js';
import * as Scene from './scene.js'
import * as UIState from '../core/ui_state.js'

/**
 * @param {HTMLElement} container
 * @param {World} world 
 * @param {UIState} ui_state 
 */
export function render(container, world, ui_state) {
    container.innerHTML += `
    <h1>Scene: Menu</h1>
    <div id="controls">
        <button data-action="switch_scene" data-scene="main">Switch to main</button>
    </div>
    `;

    // Subscribers.subscribe();
    Scene.register_actions(ACTIONS);
}

/** @type {Action[]} */
const ACTIONS = [
    {
        // @ts-ignore
        name: 'switch_scene', handler: ({ element }) => {
            const new_scene = element.dataset.scene;
            if (new_scene) {
                // UIState.set_scene(new_scene);
                if (!Scene.is_valid_scene(new_scene)) { throw new Error(`Invalid scene: ${new_scene}`); }
                UI_STATE.scene = new_scene;
                UIState.add_log(UI_STATE, `switch_scene: ${new_scene}`);
                Scene.unregister_actions(ACTIONS);
                EB.emit('scene_switched', new_scene);
            }
        }
    },
];

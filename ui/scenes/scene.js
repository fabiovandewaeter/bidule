// ui/scenes/scene.js
// @ts-check

import * as Action from '../core/action.js'
import * as MainScene from './main_scene.js'
import * as MenuScene from './menu_scene.js'
import * as Store from '../core/store.js'
import { EB } from '../../utils/event_bus.js';

export const SCENES = Object.freeze({
    MAIN: 'main',
    MENU: 'menu',
});
/**
 * @typedef {typeof SCENES[keyof typeof SCENES]} Scene
 */

/**
 * @param {string} value 
 * @returns {value is Scene}
 */
export function is_valid_scene(value) { return Object.values(SCENES).includes(/** @type {Scene} */(value)) }

/**
 * @param {Action[]} actions 
 */
export function register_actions(actions) { actions.forEach(a => Action.register(a.name, a.handler)) };
/**
 * @param {Action[]} actions 
 */
export function unregister_actions(actions) { actions.forEach(a => Action.unregister(a.name, a.handler)) };

/**
 * @param {HTMLElement} app
 */
export function render_current_scene(app) {
    app.innerHTML = '';
    const store = Store.get_store();
    switch (store.ui_state.scene) {
        case 'main': MainScene.render(app); break;
        case 'menu': MenuScene.render(app); break;
    }
}

EB.on('scene_switched', () => {
    const app = document.getElementById('app');
    if (app) render_current_scene(app);
});

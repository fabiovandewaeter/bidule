// ui/scenes/scene.js
// @ts-check

import * as Action from '../core/action.js'
import * as MainScene from './main_scene.js'
import * as MenuScene from './menu_scene.js'

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
 * @param {World} world 
 * @param {UIState} ui_state 
 */
export function render_current_scene(app, world, ui_state) {
    app.innerHTML = '';
    switch (ui_state.scene) {
        case 'main': MainScene.render(app, world, ui_state); break;
        case 'menu': MenuScene.render(app, world, ui_state); break;
    }
}

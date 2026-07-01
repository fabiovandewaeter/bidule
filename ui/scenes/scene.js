// ui/scenes/scene.js
// @ts-check

import * as Action from '../core/action.js'

export const SCENES = Object.freeze({
    MENU: 'menu',
    MAIN: 'main',
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

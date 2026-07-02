// ui/core/store.js
// @ts-check

import '../../utils/types.js'
import * as World from '../../engine/core/world.js'
import * as UIState from './ui_state.js'

/**
 * @typedef {Object} GameStore
 * @property {World} world
 * @property {UIState} ui_state
 * @property {boolean} should_save
 */

/** @type {GameStore} */
let store = {
    world: World.create(),
    ui_state: UIState.create(),
    should_save: false,
};

/** @returns {GameStore} */
export function get_store() { return store; }

/** @param {World} new_world */
export function set_world(new_world) { store.world = new_world; }
/** @param {UIState} new_ui_state */
export function set_ui_state(new_ui_state) { store.ui_state = new_ui_state; }
/** @param {boolean} val */
export function set_should_save(val) { store.should_save = val; }

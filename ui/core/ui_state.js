// ui/core/ui_state.js
// @ts-check

import * as UISB from './ui_signal_bus.js'
import * as SB from '../../utils/signal_bus.js'
import '../../utils/types.js'

/**
 * @typedef {Object} UIState
 * @property {Scene} scene
 * @property {string[]} logs
 * @property {number|null} tick_interval_id
 */

/**
 * @returns {UIState}
 */
export function create() {
    return {
        scene: 'main',
        logs: [],
        tick_interval_id: null,
    };
}

/**
 * @param {UIState} ui 
 * @param {string} log 
 */
export function add_log(ui, log) { ui.logs.push(log); SB.emit(UISB.BUS, 'logs'); }

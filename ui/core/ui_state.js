// ui/core/ui_state.js
// @ts-check

/**
 * @typedef {import("../scene/scene.js").Scene} Scene
 */
import * as UISBM from "./signals.js";
import * as SBM from "../../utils/signal_bus.js";
import "../../utils/types.js"

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
        scene: "main",
        logs: [],
        tick_interval_id: null,
    };
}

/**
 * @param {UIState} ui 
 * @param {string} log 
 */
export function add_log(ui, log) { ui.logs.push(log); SBM.emit(UISBM.BUS, "logs"); }

/**
 * @param {UIState} ui
 */
export function stop_tick(ui) {
    if (ui.tick_interval_id !== null) {
        clearInterval(ui.tick_interval_id);
        ui.tick_interval_id = null;
    }
}

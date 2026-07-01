// ui/core/ui.js
// @ts-check

import { EB } from '../../utils/event_bus.js';
import '../../utils/types.js'

// TODO: séparer les objets visibles des non visibles pour pas avoir besoin de tout parcourir à chaque fois pour vérifier si on doit update
// TODO: séparer repositories UI et engine
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
export function add_log(ui, log) { ui.logs.push(log); EB.emit('logs'); }

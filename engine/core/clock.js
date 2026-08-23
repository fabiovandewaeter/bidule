// engine/core/clock.js
// @ts-check

import '../../utils/types.js'
import * as UISB from '../../ui/core/ui_signal_bus.js'
import * as SB from '../../utils/signal_bus.js'

/**
 * @typedef {Object} Clock
 * @property {number} created_at
 * @property {number} sim_time
 */

// Note : quand on recharge une sauvegarde, runtime.js n'appelle pas Clock.create — il récupère l'objet world.clock déjà désérialisé du JSON tel quel, created_at compris. Clock.create ne sert que pour une partie neuve.
/**
 * @param {number|null} saved_timestamp
 * @returns {Clock}
 */
export function create(saved_timestamp) {
    // return { last_tick_timestamp: saved_timestamp ?? Date.now(), accumulated_time: 0 };
    const now = saved_timestamp ?? Date.now();
    return { created_at: now, sim_time: now };
}

// /**
//  * @param {Clock} clock
//  * @returns {number}
//  */
// export function tick(clock) {
//     const now = Date.now();
//     const delta_ms = now - clock.last_tick_timestamp;
//     clock.last_tick_timestamp = now;
//     clock.accumulated_time += delta_ms;

//     SB.emit(UISB.BUS, 'tick');
//     return delta_ms;
// }

/**
 * @param {Clock} clock
 * @param {number} ms
 */
export function advance_by(clock, ms) {
    clock.sim_time += ms;
    // clock.last_tick_timestamp = Date.now();
    // clock.accumulated_time += ms;
    // SB.emit(UISB.BUS, 'tick');
}

/**
 * Temps réel (ms) écoulé depuis la dernière simulation — indique s'il y a
 * du rattrapage à faire.
 * @param {Clock} clock
 * @returns {number}
 */
export function real_time_elapsed_since(clock) {
    return Date.now() - clock.sim_time;
}

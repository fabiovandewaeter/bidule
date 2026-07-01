// engine/core/clock.js
// @ts-check

import { EB } from '../../utils/event_bus.js';
import '../../utils/types.js'

/**
 * @typedef {Object} Clock
 * @property {number} last_tick_timestamp
 * @property {number} accumulated_time
 */

/**
 * @param {number|null} saved_timestamp
 * @returns {Clock}
 */
export function create(saved_timestamp) {
    return { last_tick_timestamp: saved_timestamp ?? Date.now(), accumulated_time: 0 };
}

/**
 * @param {Clock} clock
 * @returns {number}
 */
export function tick(clock) {
    const now = Date.now();
    const delta_ms = now - clock.last_tick_timestamp;
    clock.last_tick_timestamp = now;
    clock.accumulated_time += delta_ms;

    EB.emit('tick');
    return delta_ms;
}

/**
 * @param {Clock} clock
 * @param {number} ms
 */
export function advance_clock_by(clock, ms) {
    clock.last_tick_timestamp = Date.now();
    clock.accumulated_time += ms;
    EB.emit('tick');
}

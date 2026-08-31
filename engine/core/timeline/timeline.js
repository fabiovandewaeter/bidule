// engine/core/timeline/timeline.js
// @ts-check

/**
 * @typedef {import("../world.js").World} World
 */
import "../../../utils/types.js"
import * as TimelineSchedulerM from "./scheduler.js";
import * as TimelineDispatcherM from "./dispatcher.js";

/**
 * Fait avancer la simulation jusqu'à `target_time` en traitant, dans l'ordre,
 * tous les events planifiés dont `at <= target_time`.
 *
 * @param {World} world
 * @param {number} target_time
 */
export function advance_to(world, target_time) {
    while (true) {
        const event = TimelineSchedulerM.pop_due(world.timeline_scheduler, target_time);
        if (!event) break;
        TimelineDispatcherM.dispatch(world, event);
    }
}

// TODO
export function init() {
    clear_handlers();
    // Crafting.init_timeline();
    // Building.init_timeline();
}

export function clear_handlers() { }

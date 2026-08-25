// engine/core/world.js
//@ts-check

import '../../utils/types.js'
import * as Clock from './clock.js'
import * as Repo from '../../utils/repository.js'
import * as Opt from '../../utils/option.js'
import * as Res from '../../utils/result.js'
import * as TimelineScheduler from './timeline/scheduler.js'
import * as TimelineDispatcher from './timeline/dispatcher.js'
import * as Timeline from './timeline/timeline.js'

/**
 * @typedef {Object} World
 * @property {Clock} clock
 * @property {TimelineScheduler} timeline_scheduler 
 */

/**
 * @returns {World}
 */
export function create() {
    return {
        clock: Clock.create(null),
        timeline_scheduler: TimelineScheduler.create(),
    };
}

/**
 * @param {World} world 
 * @returns {World}
 */
export function init(world) {
    return {
        ...world,
    };
}

/**
 * @param {World} world
 * @param {number} target_time
 */
export function advance_to(world, target_time) {
    // /** @type {TimelineSchedule} */
    // const schedule = (type, at, payload) => TimelineScheduler.schedule(world.events, type, at, payload);

    // while (true) {
    //     const event = TimelineScheduler.pop_due(world.events, target_time);
    //     if (!event) break;
    //     TimelineDispatcher.dispatch(world, event, schedule);
    // }
    Timeline.advance_to(world, target_time);

    world.clock.sim_time = target_time;
}
/**
 * @param {World} world
 */
export function advance_to_now(world) { advance_to(world, Date.now()); }

/**
 * @param {World} world
 * @param {number} delta_ms
 */
export function advance_by(world, delta_ms) { advance_to(world, world.clock.sim_time + delta_ms); }

/**
 * @param {World} world
 * @returns {number|null} timestamp du prochain event, ou null si rien de planifié
 */
export function next_event_at(world) {
    const next = TimelineScheduler.peek(world.timeline_scheduler);
    return next ? next.at : null;
}

// /**
//  * @param {World} world
//  * @param {number} delta_ms
//  */
// export function update(world, delta_ms) {
//     // TODO: update la clock aussi ? ou faire dehors je sais pas
// }

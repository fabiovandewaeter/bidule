// engine/core/world.js
//@ts-check

import '../../utils/types.js'
import * as Clock from './clock.js'
import * as Repo from '../../utils/repository.js'
import * as Opt from '../../utils/option.js'
import * as Res from '../../utils/result.js'
import * as ScheduledEventScheduler from './scheduled_event/scheduled_event_scheduler.js'
import * as Event from './scheduled_event/scheduled_event.js'

/**
 * @typedef {Object} World
 * @property {Clock} clock
 * @property {ScheduledEventScheduler} events
 */

/**
 * @returns {World}
 */
export function create() {
    return {
        clock: Clock.create(null),
        events: ScheduledEventScheduler.create(),
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
 * Fait avancer la simulation jusqu'à `target_time` en traitant, dans l'ordre,
 * tous les events planifiés dont `at <= target_time`.
 *
 * À appeler :
 *  - au chargement d'une sauvegarde, avec target_time = Date.now() (rattrapage hors-ligne)
 *  - en jeu, avant de lire un état qui dépend du temps
 *
 * @param {World} world
 * @param {number} target_time
 */
export function advance_to(world, target_time) {
    /** @type {Schedule} */
    const schedule = (type, at, payload) => ScheduledEventScheduler.schedule(world.events, type, at, payload);

    while (true) {
        const event = ScheduledEventScheduler.pop_due(world.events, target_time);
        if (!event) break;
        Event.dispatch(world, event, schedule);
    }

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
    const next = ScheduledEventScheduler.peek(world.events);
    return next ? next.at : null;
}

// /**
//  * @param {World} world
//  * @param {number} delta_ms
//  */
// export function update(world, delta_ms) {
//     // TODO: update la clock aussi ? ou faire dehors je sais pas
// }

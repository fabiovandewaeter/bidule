// engine/core/scheduled_event/scheduled_event_scheduler.js
//@ts-check

import '../../../utils/types.js'
import * as Heap from './scheduled_event_heap.js'
import * as Repo from '../../../utils/repository.js'

/**
 * @typedef {Object} ScheduledEventScheduler
 * @property {ScheduledEventRepo} repo
 * @property {HeapEntry[]} heap
 */

/** @returns {ScheduledEventScheduler} */
export function create() {
    return { repo: Repo.create(), heap: [] };
}

/**
 * Planifie un event et le renvoie (avec son id assigné par le repo).
 * @param {ScheduledEventScheduler} schedule
 * @param {ScheduledEventType} type
 * @param {number} at
 * @param {Object} payload
 * @returns {ScheduledEvent}
 */
export function schedule(schedule, type, at, payload) {
    const event = Repo.spawn_element(schedule.repo, { type, at, payload });
    Heap.push(schedule.heap, { at: event.at, id: event.id });
    return event;
}

/**
 * Annule un event planifié. No-op silencieux s'il n'existe plus.
 * @param {ScheduledEventScheduler} schedule
 * @param {ScheduledEventID} id
 * @returns {boolean} true si l'event existait et a été annulé
 */
export function cancel(schedule, id) {
    const existed = id in schedule.repo.elements;
    if (existed) Repo.remove(schedule.repo, id);
    return existed;
}

/**
 * @param {ScheduledEventScheduler} schedule
 * @returns {ScheduledEvent|null}
 */
export function peek(schedule) {
    purge_stale(schedule);
    const top = schedule.heap[0];
    return top ? schedule.repo.elements[top.id] : null;
}

/**
 * Dépile et renvoie le prochain event si `at <= target_time`.
 * Sinon renvoie null SANS rien dépiler (l'event reste planifié).
 * @param {ScheduledEventScheduler} schedule
 * @param {number} target_time
 * @returns {ScheduledEvent|null}
 */
export function pop_due(schedule, target_time) {
    purge_stale(schedule);
    const top = schedule.heap[0];
    if (!top || top.at > target_time) return null;
    Heap.pop(schedule.heap);
    const event = schedule.repo.elements[top.id];
    Repo.remove(schedule.repo, top.id);
    return event;
}

/**
 * @param {ScheduledEventScheduler} schedule
 * @returns {ScheduledEvent[]} tous les events en attente (non triés) — utile pour debug/UI
 */
export function all_pending(schedule) { return Repo.all(schedule.repo); }

/** @param {ScheduledEventScheduler} schedule */
function purge_stale(schedule) {
    while (schedule.heap.length > 0 && !(schedule.heap[0].id in schedule.repo.elements)) {
        Heap.pop(schedule.heap);
    }
}

// TODO
// /** @type {Record<ScheduledEventType, number>} */
// const CRAFT_COMPLETE_HANDLERS = {
// };

// export function init_truc() {
//     Event.register('craft_complete', (world, event, schedule) => {
//         const machine = world.machines[event.payload.machineId];
//         // // Ici on réagit différemment selon le type de machine
//         // switch (machine.type) {
//         //     case 'forge': handleForgeComplete(world, machine, schedule); break;
//         //     case 'alambic': handleAlambicComplete(world, machine, schedule); break;
//         //     case 'botanique': handleBotaniqueComplete(world, machine, schedule); break;
//         //     // etc.
//         // }
//         CRAFT_COMPLETE_HANDLERS[machine.type](world, machine, schedule);
//     });
// }

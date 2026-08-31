// engine/core/timeline/scheduler.js
// @ts-check

/**
 * @typedef {import("./heap.js").HeapEntry} HeapEntry
 * @typedef {import("./event.js").TimelineEventType} TimelineEventType
 * @typedef {import("./event.js").TimelineEvent} TimelineEvent
 * @typedef {import("./event.js").TimelineEventID} TimelineEventID
 * @typedef {import("./event.js").TimelineEventRepo} TimelineEventRepo
 */
import "../../../utils/types.js"
import * as HeapM from "./heap.js";
import * as RepoM from "../../../utils/repository.js";

/**
 * @typedef {Object} TimelineScheduler
 * @property {TimelineEventRepo} repo
 * @property {HeapEntry[]} heap
 */

/** @returns {TimelineScheduler} */
export function create() {
    return { repo: RepoM.create(), heap: [] };
}

/**
 * Planifie un event et le renvoie (avec son id assigné par le repo).
 * @param {TimelineScheduler} scheduler
 * @param {TimelineEventType} type
 * @param {number} at
 * @param {Object} payload
 * @returns {TimelineEvent}
 */
export function schedule(scheduler, type, at, payload) {
    const event = RepoM.spawn_element(scheduler.repo, { type, at, payload });
    HeapM.push(scheduler.heap, { at: event.at, id: event.id });
    return event;
}

/**
 * Annule un event planifié. No-op silencieux s'il n'existe plus.
 * @param {TimelineScheduler} scheduler
 * @param {TimelineEventID} id
 * @returns {boolean} true si l'event existait et a été annulé
 */
export function cancel(scheduler, id) {
    const existed = id in scheduler.repo.elements;
    if (existed) RepoM.remove(scheduler.repo, id);
    return existed;
}

/**
 * @param {TimelineScheduler} scheduler
 * @returns {TimelineEvent|null}
 */
export function peek(scheduler) {
    purge_stale(scheduler);
    const top = scheduler.heap[0];
    return top ? scheduler.repo.elements[top.id] : null;
}

/**
 * Dépile et renvoie le prochain event si `at <= target_time`.
 * Sinon renvoie null SANS rien dépiler (l'event reste planifié).
 * @param {TimelineScheduler} scheduler
 * @param {number} target_time
 * @returns {TimelineEvent|null}
 */
export function pop_due(scheduler, target_time) {
    purge_stale(scheduler);
    const top = scheduler.heap[0];
    if (!top || top.at > target_time) return null;
    HeapM.pop(scheduler.heap);
    const event = scheduler.repo.elements[top.id];
    RepoM.remove(scheduler.repo, top.id);
    return event;
}

/**
 * @param {TimelineScheduler} scheduler
 * @returns {TimelineEvent[]} tous les events en attente (non triés) — utile pour debug/UI
 */
export function all_pending(scheduler) { return RepoM.all(scheduler.repo); }

/** @param {TimelineScheduler} scheduler */
function purge_stale(scheduler) {
    while (scheduler.heap.length > 0 && !(scheduler.heap[0].id in scheduler.repo.elements)) {
        HeapM.pop(scheduler.heap);
    }
}

// TODO: voir si on garde ça (probablement oui)
// /** @type {Record<TimelineEventType, number>} */
// const CRAFT_COMPLETE_HANDLERS = {
// };
// export function init_truc() {
//     Event.register("craft_complete", (world, event, scheduler) => {
//         const machine = world.machines[event.payload.machineId];
//         // // Ici on réagit différemment selon le type de machine
//         // switch (machine.type) {
//         //     case "forge": handleForgeComplete(world, machine, scheduler); break;
//         //     case "alambic": handleAlambicComplete(world, machine, scheduler); break;
//         //     case "botanique": handleBotaniqueComplete(world, machine, scheduler); break;
//         //     // etc.
//         // }
//         CRAFT_COMPLETE_HANDLERS[machine.type](world, machine, scheduler);
//     });
// }

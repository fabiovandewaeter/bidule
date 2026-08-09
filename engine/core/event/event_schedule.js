// engine/core/event/event_schedule.js
//@ts-check

import '../../../utils/types.js'
import * as Heap from './event_heap.js'
import * as Repo from '../../../utils/repository.js'

/**
 * @typedef {Object} GameEventSchedule
 * @property {GameEventRepo} repo
 * @property {HeapEntry[]} heap
 */

/** @returns {GameEventSchedule} */
export function create() {
    return { repo: Repo.create(), heap: [] };
}

/**
 * Planifie un event et le renvoie (avec son id assigné par le repo).
 * @param {GameEventSchedule} schedule
 * @param {GameEventType} type
 * @param {number} at
 * @param {Object} payload
 * @returns {GameEvent}
 */
export function schedule(schedule, type, at, payload) {
    const event = Repo.spawn_element(schedule.repo, { type, at, payload });
    Heap.push(schedule.heap, { id: event.id, at: event.at });
    return event;
}

/**
 * Annule un event planifié. No-op silencieux s'il n'existe plus.
 * @param {GameEventSchedule} schedule_
 * @param {GameEventID} id
 * @returns {boolean} true si l'event existait et a été annulé
 */
export function cancel(schedule_, id) {
    const existed = id in schedule_.repo.elements;
    if (existed) Repo.remove(schedule_.repo, id);
    return existed;
}

/**
 * @param {GameEventSchedule} schedule
 * @returns {GameEvent|null}
 */
export function peek(schedule) {
    purge_stale(schedule);
    const top = schedule.heap[0];
    return top ? schedule.repo.elements[top.id] : null;
}

/**
 * Dépile et renvoie le prochain event si `at <= target_time`.
 * Sinon renvoie null SANS rien dépiler (l'event reste planifié).
 * @param {GameEventSchedule} schedule
 * @param {number} target_time
 * @returns {GameEvent|null}
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
 * @param {GameEventSchedule} schedule
 * @returns {GameEvent[]} tous les events en attente (non triés) — utile pour debug/UI
 */
export function all_pending(schedule) {
    return Repo.all(schedule.repo);
}

/** @param {GameEventSchedule} schedule */
function purge_stale(schedule) {
    while (schedule.heap.length > 0 && !(schedule.heap[0].id in schedule.repo.elements)) {
        Heap.pop(schedule.heap);
    }
}

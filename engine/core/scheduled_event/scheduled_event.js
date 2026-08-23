// engine/core/scheduled_event/scheduled_event.js
//@ts-check

// craft_complete, building_complete, potion_effect ...

/** @typedef {'craft_complete'|'building_complete'|'potion_effect'} ScheduledEventType */

/** @typedef {number & {__brand:"ScheduledEventID"}} ScheduledEventID*/
/**
 * @typedef {Object} ScheduledEvent
 * @property {ScheduledEventID} id
 * @property {ScheduledEventType} type
 * @property {number} at
 * @property {Object} payload
 */

/**
 * Fonction fournie aux handlers pour planifier un nouvel event
 * (ex: un craft qui se termine planifie le suivant de la file).
 * @typedef {(type: ScheduledEventType, at: number, payload: Object) => ScheduledEvent} Schedule
 */
/** @typedef {(world: World, event: ScheduledEvent, schedule: Schedule) => void} EventHandler */

/** @type {Partial<Record<ScheduledEventType, EventHandler>>} */
const HANDLERS = {};

/**
 * Un module de feature (crafting.js, building.js...) s'enregistre lui-même
 * au chargement. Ça évite que event.js doive importer chaque feature
 * (et donc évite les imports circulaires feature <-> event).
 * @param {ScheduledEventType} type
 * @param {EventHandler} handler
 */
export function register(type, handler) {
    HANDLERS[type] = handler;
}

/**
 * @param {World} world 
 * @param {ScheduledEvent} event 
 * @param {Schedule} schedule 
 */
export function dispatch(world, event, schedule) {
    const handler = HANDLERS[event.type];
    if (!handler) throw new Error(`Aucun handler enregistré pour l'event type: ${event.type}`);
    handler(world, event, schedule);
}

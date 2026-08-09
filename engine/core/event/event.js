// engine/core/event/event.js
//@ts-check

/** @typedef {number & {__brand:"GameEventID"}} GameEventID*/
/**
 * @typedef {Object} GameEvent
 * @property {GameEventID} id
 * @property {GameEventType} type
 * @property {number} at
 * @property {Object} payload
 */

/** @typedef {'craft_complete'|'building_complete'} GameEventType */

/**
 * Fonction fournie aux handlers pour planifier un nouvel event
 * (ex: un craft qui se termine planifie le suivant de la file).
 * @typedef {(type: GameEventType, at: number, payload: Object) => GameEvent} Schedule
 */
/** @typedef {(world: World, event: GameEvent, schedule: Schedule) => World} EventHandler */

/** @type {Partial<Record<GameEventType, EventHandler>>} */
const HANDLERS = {};

/**
 * Un module de feature (crafting.js, building.js...) s'enregistre lui-même
 * au chargement. Ça évite que event.js doive importer chaque feature
 * (et donc évite les imports circulaires feature <-> event).
 * @param {GameEventType} type
 * @param {EventHandler} handler
 */
export function register(type, handler) {
    HANDLERS[type] = handler;
}

/**
 * @param {World} world 
 * @param {GameEvent} event 
 * @param {Schedule} schedule 
 */
export function dispatch(world, event, schedule) {
    const handler = HANDLERS[event.type];
    if (!handler) throw new Error(`Aucun handler enregistré pour l'event type: ${event.type}`);
    // return handler(world, event, schedule);
    handler(world, event, schedule);
}

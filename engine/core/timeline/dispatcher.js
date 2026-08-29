// engine/core/timeline/dispatcher.js
//@ts-check

/**
 * @typedef {import("../world").World} World
 */

/**
 * @typedef {import("./event.js").TimelineEvent} TimelineEvent
 * @typedef {import("./event.js").TimelineEventType} TimelineEventType
 * 
 * @typedef {(world: World, event: TimelineEvent) => void} TimelineEventHandler
 */

/** @type {Partial<Record<TimelineEventType, TimelineEventHandler>>} */
const HANDLERS = {};

/**
 * @param {TimelineEventType} type
 * @param {TimelineEventHandler} handler
 */
export function register(type, handler) { HANDLERS[type] = handler; }

/**
 * @param {World} world 
 * @param {TimelineEvent} event 
 */
export function dispatch(world, event) {
    const handler = HANDLERS[event.type];
    if (!handler) {
        throw new Error(`Aucun handler enregistré pour l'event type: ${event.type}`);
    }
    handler(world, event);
}

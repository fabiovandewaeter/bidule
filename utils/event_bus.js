// utils/event_bus.js
// @ts-check

// TODO: retirer et faire injection de dépendance si besoin de plusieurs event bus

/** @typedef {'tick'|'logs'|'scene_switched'|'toggle_tick'} EventName */

/**
 * @typedef {Object} EventBus
 * @property {(event: EventName, callback: Function) => () => void} on
 * @property {(event: EventName, callback: Function) => void} off
 * @property {(event: EventName, ...args: any[]) => void} emit
 * @property {Object.<EventName, Function[]>} listeners
 */

export const EB = create();

/**
 * @returns {EventBus}
 */
export function create() {
    /** @type {Object.<EventName, Function[]>} */
    const listeners = {};

    return {
        /**
         * @param {EventName} event 
         * @param {Function} callback 
         * @returns {() => void}
         */
        on(event, callback) {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(callback);
            return () => this.off(event, callback);
        },
        /**
         * @param {EventName} event 
         * @param {Function} callback 
         */
        off(event, callback) {
            if (listeners[event]) {
                //@ts-ignore
                listeners[event] = listeners[event].filter(cb => cb !== callback);
            }
        },
        /**
         * @param {EventName} event 
         * @param  {...any} args 
         */
        emit(event, ...args) {
            if (listeners[event]) {
                for (const cb of listeners[event]) {
                    cb(...args);
                }
            }
        },
        listeners
    };
}

/**
 * @param {EventBus} event_bus 
 */
export function clear(event_bus) { Object.keys(event_bus.listeners).forEach(key => delete event_bus.listeners[key]); }

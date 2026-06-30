// utils/event_bus.js
// @ts-check

// TODO: retirer et faire injection de dépendance si besoin de plusieurs event bus
export const EB = create();

// export const Events = Object.freeze({
//     TICK: 'tick',
// });
// /** @typedef {typeof Events[keyof Events]} EventName */
/** @typedef {'tick'} EventName */

/**
 * @typedef {Object} EventBus
 * @property {(event: EventName, callback: Function) => () => void} on
 * @property {(event: EventName, callback: Function) => void} off
 * @property {(event: EventName, ...args: any[]) => void} emit
 */

/**
 * @returns {EventBus}
 */
export function create() {
    /** @type {Object.<EventName, Function[]>} */
    const listeners = {};

    const api = {
        /**
         * @param {EventName} event 
         * @param {Function} callback 
         * @returns {() => void}
         */
        on(event, callback) {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(callback);
            return () => api.off(event, callback);
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
        }
    };

    return api;
}

// utils/signal_bus.js
// @ts-check

/**
 * @typedef {import("../ui/core/signals.js").UISignalType} UISignalType
 * @typedef {import("../engine/core/signals.js").EngineSignalType} EngineSignalType
 */
import "./types.js"

/** @typedef {UISignalType|EngineSignalType} SignalType */
/**
 * @template {SignalType} SType
 * @typedef {Object} SignalBus
 * @property {Partial<Record<SType, Function[]>>} listeners
 */
//  * @property {(signal_type: signal_typeName, callback: Function) => () => void} on
//  * @property {(signal_type: signal_typeName, callback: Function) => void} off
//  * @property {(signal_type: signal_typeName, ...args: any[]) => void} emit
//  * @property {Object.<signal_typeName, Function[]>} listeners

/**
 * @template {SignalType} SType
 * @returns {SignalBus<SType>}
 */
export function create() { return { listeners: {} }; }

/**
 * @template {SignalType} SType
 * @param {SignalBus<SType>} bus
 * @param {SType} signal_type
 * @param {Function} callback 
 * @returns {() => void}
 */
export function on(bus, signal_type, callback) {
    const handlers = (bus.listeners[signal_type] ??= []);
    if (handlers.includes(callback)) throw new Error(`cannot add because handlers.includes(callback) returned true: ${signal_type} ${callback}`);
    handlers.push(callback);
    return () => off(bus, signal_type, callback);
}

/**
 * @template {SignalType} SType
 * @param {SignalBus<SType>} bus
 * @param {SType} signal_type
 * @param {Function} callback 
 */
export function off(bus, signal_type, callback) {
    const handlers = bus.listeners[signal_type];
    if (!handlers || handlers.length === 0) return;
    bus.listeners[signal_type] = handlers.filter(cb => cb !== callback);
    if (bus.listeners[signal_type].length === 0) {
        delete bus.listeners[signal_type];
    }
}

/**
 * @template {SignalType} SType
 * @param {SignalBus<SType>} bus
 * @param {SType} signal_type 
 * @param  {...any} args 
 */
export function emit(bus, signal_type, ...args) {
    const handlers = bus.listeners[signal_type];
    if (!handlers || handlers.length === 0) return;
    // Copie pour éviter les problèmes si un callback modifie les abonnements pendant l'émission
    const to_call = handlers.slice();
    for (const cb of to_call) {
        cb(...args);
    }
}

/**
 * @template {SignalType} SType
 * @param {SignalBus<SType>} bus
 */
export function clear(bus) {
    for (const key of /** @type {SType[]} */ (Object.keys(bus.listeners))) {
        delete bus.listeners[key];
    }
}

// ui/core/view/subscribers.js
// @ts-check

import '../../../utils/types.js'

/** @type {Map<string, (prev: Model|null, next: Model) => void>} */
let subscribers = new Map();

/**
 * @param {string} key
 * @param {(prev: Model|null, next: Model) => void} fn
 */
export function subscribe(key, fn) {
    if (subscribers.has(key)) throw new Error();
    subscribers.set(key, fn);
}

/**
 * @param {string} key 
 */
export function unsubscribe(key) { subscribers.delete(key); }

export function clear() { subscribers = new Map(); }

/**
 * @param {Model|null} prev
 * @param {Model} next 
 */
export function notify(prev, next) { subscribers.forEach(fn => fn(prev, next)); }

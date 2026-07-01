// ui/core/action.js
// @ts-check

import '../../utils/types.js'
import * as Opt from '../../utils/option.js'

/** @typedef {'toggle_tick'} ActionName */

/**
 * @typedef {Object} ActionContext
 * @property {HTMLElement} element - l'élément cliqué
 * @property {Event} event - l'événement natif
 */

/**
 * @typedef {Object} Action
 * @property {ActionName} name
 * @property {ActionHandler} handler
 */

/**
 * @callback ActionHandler
 * @param {ActionContext} ctx
 */

/** @type {Object.<string, ActionHandler>} */
const registry = {};

/**
 * Enregistre une nouvelle action.
 * @param {ActionName} name
 * @param {ActionHandler} handler
 */
export function register(name, handler) {
    if (registry[name]) {
        console.warn(`Action "${name}" déjà enregistrée, elle sera remplacée.`);
    }
    registry[name] = handler;
}

/**
 * @param {ActionName} name
 * @param {ActionHandler} handler
 */
export function unregister(name, handler) {
    const action = registry[name];
    if (!action) return;
    // si vrai ça veut dire que l'action actuelle vient d'autre part que là où on a appelé unregister
    if (action !== handler) throw new Error(`Action ${name} n'avait déjà plus le même handler`);

    delete registry[name];
}

/**
 * Retourne le handler associé au nom de l'action.
 * @param {ActionName} name
 * @returns {Opt<ActionHandler>}
 */
export function get(name) {
    const res = registry[name];
    return res !== undefined ? Opt.some(res) : Opt.none;
}

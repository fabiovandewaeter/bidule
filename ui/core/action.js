// ui/core/action.js
// @ts-check

import '../../utils/types.js'
import * as Opt from '../../utils/option.js'

/** @typedef {'tick'} ActionName */

/**
 * @typedef {Object} ActionContext
 * @property {HTMLElement} element - l'élément cliqué
 * @property {Event} event - l'événement natif
 * @property {World} world - l'instance du monde du jeu
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
 * Retourne le handler associé au nom de l'action.
 * @param {ActionName} name
 * @returns {Opt<ActionHandler>}
 */
export function get(name) {
    const res = registry[name];
    return res !== undefined ? Opt.some(res) : Opt.none;
}

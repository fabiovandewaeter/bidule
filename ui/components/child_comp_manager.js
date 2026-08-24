// ui/components/child_comp_manager.js
// @ts-check

import '../../utils/types.js'

/**
 * @typedef {Object} ChildComp
 * @property {() => void} destroy
 */

/** @typedef {string & {__brand:"ChildCompKey"}} ChildCompKey*/
/**
 * @typedef {Object} ChildCompManager
 * @property {Map<ChildCompKey, ChildComp>} children
 */

/**
 * @returns {ChildCompManager}
 */
export function create() { return { children: new Map() } };

/**
 * @param {ChildCompManager} manager
 * @param {ChildCompKey} key
 * @returns {boolean}
 */
export function has(manager, key) {
    return manager.children.has(key);
}

/**
 * @param {ChildCompManager} manager
 * @param {ChildCompKey} key
 * @param {ChildComp} child
 */
export function add(manager, key, child) {
    // if (manager.children.has(key)) {
    if (has(manager, key)) {
        throw new Error(`child_comp_manager: la clé "${String(key)}" existe déjà`);
    }
    manager.children.set(key, child);
}

/**
 * @param {ChildCompManager} manager
 * @param {ChildCompKey} key
 * @returns {boolean} true si un enfant a bien été supprimé
 */
export function remove(manager, key) {
    const child = manager.children.get(key);
    if (!child) return false;
    child.destroy();
    manager.children.delete(key);
    return true;
}

/**
 * @param {ChildCompManager} manager
 */
export function destroy_all(manager) {
    const reversed = [...manager.children.values()].reverse();
    for (const child of reversed) child.destroy();
    manager.children.clear();
}

/**
 * Ajoute l'enfant s'il est absent, le détruit s'il est présent. Le cas d'usage
 * "un bouton spawn/destroy un component" (menu, hide_logs...) tient en un appel.
 * @param {ChildCompManager} manager
 * @param {string} key
 * @param {() => ChildComp} create_child - appelé seulement si besoin de créer
 * @returns {boolean} true si l'enfant vient d'être ajouté, false s'il vient d'être supprimé
 */
export function toggle_child(manager, key, create_child) {
    const converted_key = /**@type {ChildCompKey} */(key);
    if (remove(manager, converted_key)) return false;
    add(manager, converted_key, create_child());
    return true;
}

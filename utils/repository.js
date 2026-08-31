// utils/repository.js
// @ts-check

import "./types.js"
import { some, none } from "./option.js";
import { ok, err } from "./result.js";

/**
 * @template {number} TID
 * @template T
 * @typedef {Object} Repo
 * @property {TID} current_id
 * @property {Record<TID, T>} elements
 */

/**
 * @template T
 * @template {number} TID
 * @returns {Repo<TID, T>}
 */
export function create() { return { current_id: /**@type {TID}*/(0), elements: /** @type {Record<TID, T>}*/({}) }; }

/**
 * @template T
 * @template {number} TID
 * @template {Omit<T, "id">} TSpawnArgs
 * @param {Repo<TID, T>} repo
 * @param {TSpawnArgs} args
 * @returns {T}
 */
export function spawn_element(repo, args) {
    const id = repo.current_id;
    const new_element = /**@type {T} */({ id, ...args });
    repo.elements[id] = new_element;
    repo.current_id = next_id(repo);
    return new_element;
}

/**
 * @template T
 * @template {number} TID
 * @param {Repo<TID, T>} repo
 * @param {TID} id
 * @returns {Opt<T>}
 */
export function get(repo, id) {
    const res = repo.elements[id];
    return res != null && res !== undefined ? some(/**@type {T}*/(res)) : none;
}

/**
 * @template T
 * @template {number} TID
 * @param {Repo<TID, T>} repo
 * @returns {TID}
 */
export function next_id(repo) { return /**@type {TID}*/(repo.current_id + 1); }

/**
 * @template T
 * @template {number} TID
 * @param {Repo<TID, T>} repo
 * @param {TID} id
 * @returns {Res<void, string>}
 */
export function remove(repo, id) {
    if (!(id in repo.elements)) return err(`Couldn't delete element: ${id}`);
    delete repo.elements[id];
    return ok(undefined);
}

/**
 * @template T
 * @template {number} TID
 * @param {Repo<TID, T>} repo
 * @return {TID[]}
 */
export function all_ids(repo) { return /**@type {TID[]}*/(Object.keys(repo.elements).map(Number)); }

/**
 * @template T
 * @template {number} TID
 * @param {Repo<TID, T>} repo
 * @return {T[]}
 */
export function all(repo) { return Object.values(repo.elements); }

// engine/entity/team.js
// @ts-check

/**
 * @typedef {import("./group.js").Group} Group
 * @typedef {import("../entity/entity.js").EntityID} EntityID
 */
import * as GroupM from "./group.js";

/**
 * pour les combats
 * @typedef {Object} Team
 * @property {string} name
 * @property {Group} alive_members
 * @property {Group} dead_members
 */

/**
 * @param {string} name 
 * @param {EntityID[]} members 
 * @returns {Team}
 */
export function create(name, members) {
    return {
        name,
        alive_members: GroupM.create_from(name, members),
        dead_members: GroupM.create(name),
    }
}

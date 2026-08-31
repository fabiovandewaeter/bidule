// engine/entity/group.js
// @ts-check

/**
 * @typedef {import("./entity.js").EntityID} EntityID
 * @typedef {import("../map/room.js").RoomID} RoomID
 */
import "../../utils/types.js"
import * as OptM from "../../utils/option.js";

/**
 * @typedef {Object} Group
 * @property {string} name
 * @property {EntityID[]} entities
 * @property {Opt<number>} max_size none pour illimité
 */

/**
 * @param {string} name
 * @param {number} [max_size]
 * @returns {Group}
 */
export function create(name, max_size) {
    return {
        name,
        entities: [],
        max_size: max_size ? OptM.some(max_size) : OptM.none,
    };
}
/**
 * @param {string} name
 * @param {EntityID[]} members
 * @param {number} [max_size]
 * @returns {Group}
 */
export function create_from(name, members, max_size) {
    if (max_size && max_size < members.length) throw new Error(`members.length: ${members.length}, max_size: ${max_size}`);
    const group = create(name, max_size);
    for (const entity of members) {
        add_entity(group, entity);
    }
    return group;
}

/**
 * passer par méthodes du World à la place
 * @param {Group} group
 * @param {EntityID} entity_id
 */
export function add_entity(group, entity_id) {
    if (group.entities.includes(entity_id)) throw new Error(`entity_id already in this group: ${group.name} ${entity_id}`);
    // if (group.entities.length >= group.max_size) throw new Error(`group full: ${group.name}`);
    if (OptM.is_some(group.max_size) && group.entities.length >= group.max_size.value) throw new Error(`group full: ${group.name}`);
    group.entities.push(entity_id);
}
/**
 * passer par méthodes du World à la place
 * @param {Group} group
 * @param {EntityID} entity_id
 */
export function remove_entity(group, entity_id) {
    if (!group.entities.includes(entity_id)) throw new Error(`entity_id is not in this group: ${group.name} ${entity_id}`);
    group.entities = group.entities.filter(e => e != entity_id);
}

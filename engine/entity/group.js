// engine/entity/group.js
//@ts-check

/**
 * @typedef {import('./entity.js').EntityID} EntityID
 * @typedef {import('../map/room.js').RoomID} RoomID
 */
import '../../utils/types.js'
import * as RepoM from '../../utils/repository.js'
import * as OptM from '../../utils/option.js'
import * as SBM from '../../utils/signal_bus.js'
import * as UISBM from '../../ui/core/signals.js'

/**
 * @typedef {Object} Group
 * @property {string} name
 * @property {EntityID[]} entities
 * @property {number} max_size
 */

/**
 * @param {string} name
 * @param {number} max_size
 * @returns {Group}
 */
export function create(name, max_size) {
    return {
        name,
        entities: [],
        max_size,
    };
}

/**
 * passer par méthodes du World à la place
 * @param {Group} group
 * @param {EntityID} entity_id
 */
export function add_entity(group, entity_id) {
    if (group.entities.includes(entity_id)) throw new Error(`entity_id already in this group: ${group.name} ${entity_id}`);
    if (group.entities.length >= group.max_size) throw new Error(`group full: ${group.name}`);
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

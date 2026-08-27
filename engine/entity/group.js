// engine/entity/group.js
//@ts-check

/**
 * @typedef {import('./entity.js').EntityID} EntityID
 * @typedef {import('../map/room.js').RoomID} RoomID
 */
import '../../utils/types.js'
import * as RepoM from '../../utils/repository.js'
import * as OptM from '../../utils/option.js'
import * as ResM from '../../utils/result.js'
import { some, none } from '../../utils/option.js'
import { ok, err } from '../../utils/result.js'
import * as SBM from '../../utils/signal_bus.js'
import * as UISBM from '../../ui/core/signals.js'

/**
 * @typedef {number & {__brand:"GroupID"}} GroupID
 * @typedef {import('../../utils/repository.js').Repo<GroupID, Group>} GroupRepo
 * 
 * @typedef {Object} Group
 * @property {GroupID} id
 * @property {string} name
 * @property {EntityID[]} entities
 * @property {number} max_size
 */

/**
 * @param {GroupRepo} repo
 * @param {string} name
 * @param {number} max_size
 * @returns {Group}
 */
export function spawn(repo, name, max_size) {
    return RepoM.spawn_element(repo, {
        name,
        entities: [],
        max_size,
    });
}

/**
 * passer par méthodes du World à la place
 * @param {GroupRepo} group_repo 
 * @param {GroupID} group_id 
 * @param {EntityID} entity_id
 */
export function add_entity(group_repo, group_id, entity_id) {
    const group = OptM.unwrap(RepoM.get(group_repo, group_id));
    if (group.entities.includes(entity_id)) throw new Error(`entity_id already in this group: ${group.id} ${entity_id}`);
    group.entities.push(entity_id);
    SBM.emit(UISBM.BUS, 'group_modified');
}
/**
 * passer par méthodes du World à la place
 * @param {GroupRepo} group_repo 
 * @param {GroupID} group_id 
 * @param {EntityID} entity_id
 */
export function remove_entity(group_repo, group_id, entity_id) {
    const group = OptM.unwrap(RepoM.get(group_repo, group_id));
    if (!group.entities.includes(entity_id)) throw new Error(`entity_id is not in this group: ${group.id} ${entity_id}`);
    group.entities = group.entities.filter(e => e != entity_id);
    SBM.emit(UISBM.BUS, 'group_modified');
}

// Faction.spawn(trucs_pour_group, truc pour faction){
//     const group = Repo.spawn_element(trucs_pour_group);
//     return {
//         ...truc_pour_faction,
//         group
//     }
// }

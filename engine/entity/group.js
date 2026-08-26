// engine/entity/group.js
//@ts-check

import '../../utils/types.js'
import * as Repo from '../../utils/repository.js'
import * as Opt from '../../utils/option.js'
import * as Res from '../../utils/result.js'
import { some, none } from '../../utils/option.js'
import { ok, err } from '../../utils/result.js'
import * as SB from '../../utils/signal_bus.js'
import * as UISB from '../../ui/core/signals.js'

/** @typedef {number & {__brand:"GroupID"}} GroupID */
/**
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
    return Repo.spawn_element(repo, {
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
    const group = Opt.unwrap(Repo.get(group_repo, group_id));
    if (group.entities.includes(entity_id)) throw new Error(`entity_id already in this group: ${group.id} ${entity_id}`);
    group.entities.push(entity_id);
    SB.emit(UISB.BUS, 'group_modified');
}
/**
 * passer par méthodes du World à la place
 * @param {GroupRepo} group_repo 
 * @param {GroupID} group_id 
 * @param {EntityID} entity_id
 */
export function remove_entity(group_repo, group_id, entity_id) {
    const group = Opt.unwrap(Repo.get(group_repo, group_id));
    if (!group.entities.includes(entity_id)) throw new Error(`entity_id is not in this group: ${group.id} ${entity_id}`);
    group.entities = group.entities.filter(e => e != entity_id);
    SB.emit(UISB.BUS, 'group_modified');
}

// Faction.spawn(trucs_pour_group, truc pour faction){
//     const group = Repo.spawn_element(trucs_pour_group);
//     return {
//         ...truc_pour_faction,
//         group
//     }
// }

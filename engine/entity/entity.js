// engine/entity/entity.js
//@ts-check

import * as UISB from '../../ui/core/signals.js'
import * as ESB from '../core/signals.js'
import * as Repo from '../../utils/repository.js'
import * as Opt from '../../utils/option.js'
import * as SB from '../../utils/signal_bus.js'

/** @typedef {number & {__brand:"EntityID"}} EntityID */
/**
 * @typedef {Object} Entity
 * @property {EntityID} id
 * @property {string} name
 * @property {RoomID} room_id
 * @property {Opt<GroupID>} group_id
 */
// TODO: classe de départ donne boost de début mais on peut tout maxer ça va juste dépendre des combinaisons qu'on fait

/**
 * @param {EntityRepo} repo
 * @param {string} name
 * @param {RoomID} room_id
 * @param {GroupID} [group_id] 
 * @returns {Entity}
 */
export function spawn(repo, name, room_id, group_id) {
    return Repo.spawn_element(repo, {
        name,
        room_id,
        group_id: group_id ? Opt.some(group_id) : Opt.none,
    });
}

/**
 * @param {EntityRepo} repo 
 * @param {EntityID} entity_id 
 * @param {RoomID} target_id
 * @returns {RoomID}
 */
export function move(repo, entity_id, target_id) {
    const entity = Opt.unwrap(Repo.get(repo, entity_id));
    const previous_room_id = entity.room_id;
    entity.room_id = target_id;
    SB.emit(UISB.BUS, 'entity_changed', entity_id);
    return previous_room_id;
}

/**
 * @param {EntityRepo} repo 
 * @param {EntityID} entity_id 
 * @param {GroupID} group_id
 * @returns {Opt<GroupID>}
 */
export function change_group(repo, entity_id, group_id) {
    const entity = Opt.unwrap(Repo.get(repo, entity_id));
    const previous_group_id = entity.group_id;
    entity.group_id = Opt.some(group_id);
    SB.emit(UISB.BUS, 'entity_changed', entity_id);
    return previous_group_id;
}

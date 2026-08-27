// engine/entity/entity.js
//@ts-check

/**
 * @typedef {import('./group.js').GroupID} GroupID
 * @typedef {import('../map/room.js').RoomID} RoomID
 */
import * as UISBM from '../../ui/core/signals.js'
import * as RepoM from '../../utils/repository.js'
import * as OptM from '../../utils/option.js'
import * as SBM from '../../utils/signal_bus.js'

/**
 * @typedef {number & {__brand:"EntityID"}} EntityID
 * @typedef {import('../../utils/repository.js').Repo<EntityID, Entity>} EntityRepo
 * 
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
    return RepoM.spawn_element(repo, {
        name,
        room_id,
        group_id: group_id ? OptM.some(group_id) : OptM.none,
    });
}

/**
 * @param {EntityRepo} repo 
 * @param {EntityID} entity_id 
 * @param {RoomID} target_id
 * @returns {RoomID}
 */
export function move(repo, entity_id, target_id) {
    const entity = OptM.unwrap(RepoM.get(repo, entity_id));
    const previous_room_id = entity.room_id;
    entity.room_id = target_id;
    SBM.emit(UISBM.BUS, 'entity_changed', entity_id);
    return previous_room_id;
}

/**
 * @param {EntityRepo} repo 
 * @param {EntityID} entity_id 
 * @param {GroupID} group_id
 * @returns {Opt<GroupID>}
 */
export function change_group(repo, entity_id, group_id) {
    const entity = OptM.unwrap(RepoM.get(repo, entity_id));
    const previous_group_id = entity.group_id;
    entity.group_id = OptM.some(group_id);
    SBM.emit(UISBM.BUS, 'entity_changed', entity_id);
    return previous_group_id;
}

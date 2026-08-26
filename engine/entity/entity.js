// engine/entity/entity.js
//@ts-check

import * as Repo from '../../utils/repository.js'
import * as Opt from '../../utils/option.js'

/** @typedef {number & {__brand:"EntityID"}} EntityID */
/**
 * @typedef {Object} Entity
 * @property {EntityID} id
 * @property {string} name
 * @property {RoomID} room_id
 */

/**
 * @param {EntityRepo} repo
 * @param {string} name
 * @param {RoomID} room_id
 * @returns {Entity}
 */
export function spawn(repo, name, room_id) {
    return Repo.spawn_element(repo, {
        name,
        room_id,
    });
}

/**
 * @param {EntityRepo} repo 
 * @param {EntityID} entity_id 
 * @param {RoomID} target_id
 */
export function move(repo, entity_id, target_id) {
    const entity = Opt.unwrap(Repo.get(repo, entity_id));
    entity.room_id = target_id;
}

// engine/map/room.js
// @ts-check

import '../../utils/types.js'
import * as UISB from '../../ui/core/signals.js'
import * as Repo from '../../utils/repository.js'
import * as Opt from '../../utils/option.js'
import * as SB from '../../utils/signal_bus.js'

/**
 * @typedef {'city'|'river'|'forest'|'mountain'} RoomType
 * @typedef {number & {__brand:"RoomID"}} RoomID
 * 
 * @typedef {Object} Room
 * @property {RoomID} id
 * @property {RoomType} type
 * @property {string} name
 * @property {Record<string, RoomExit>} exits // "north", "portal"
 * @property {EntityID[]} entities
 */

/**
 * Un seul sens, ajouter conditions passage, cooldown etc.
 * @typedef {Object} RoomExit
 * @property {RoomID} target_id
 */

/**
 * @param {RoomRepo} repo
 * @param {RoomType} type
 * @param {string} name
 * @returns {Room}
 */
export function spawn(repo, type, name) {
    return Repo.spawn_element(repo, {
        type,
        name,
        exits: {},
        entities: [],
    });
}

/**
 * @param {RoomRepo} repo 
 * @param {RoomID} id
 * @param {string} name
 * @param {RoomExit} exit 
 */
export function add_exit(repo, id, name, exit) {
    const room = Opt.unwrap(Repo.get(repo, id));
    if (Object.keys(room.exits).includes(name)) throw new Error(`exit name already used for this room: ${room.id} ${name}`);
    room.exits[name] = exit;
    SB.emit(UISB.BUS, 'room_modified');
}

/**
 * passer par méthodes du World à la place
 * @param {RoomRepo} repo 
 * @param {RoomID} id
 * @param {EntityID} entity_id
 */
export function add_entity(repo, id, entity_id) {
    const room = Opt.unwrap(Repo.get(repo, id));
    if (room.entities.includes(entity_id)) throw new Error(`entity_id already in this room: ${room.id} ${entity_id}`);
    room.entities.push(entity_id);
    SB.emit(UISB.BUS, 'room_modified');
}
/**
 * passer par méthodes du World à la place
 * @param {RoomRepo} repo 
 * @param {RoomID} id
 * @param {EntityID} entity_id
 */
export function remove_entity(repo, id, entity_id) {
    const room = Opt.unwrap(Repo.get(repo, id));
    if (!room.entities.includes(entity_id)) throw new Error(`entity_id is not in this room: ${room.id} ${entity_id}`);
    room.entities = room.entities.filter(e => e != entity_id);
    SB.emit(UISB.BUS, 'room_modified');
}

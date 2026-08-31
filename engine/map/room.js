// engine/map/room.js
// @ts-check

/**
 * @typedef {import("../entity/entity.js").EntityID} EntityID
 */
import "../../utils/types.js"
import * as UISBM from "../../ui/core/signals.js";
import * as RepoM from "../../utils/repository.js";
import * as OptM from "../../utils/option.js";
import * as SBM from "../../utils/signal_bus.js";

export const ROOM_TYPES = Object.freeze(/**@type {const}*/({
    CITY: "city",
    RIVER: "river",
    FOREST: "forest",
    MOUNTAIN: "mountain",
}));
/** @typedef {EnumValue<typeof ROOM_TYPES>} RoomType */

/**
 * @typedef {Object} Room
 * @property {RoomID} id
 * @property {RoomType} type
 * @property {string} name
 * @property {Record<string, RoomExit>} exits // "north", "portal"
 * @property {EntityID[]} entities
 * 
 * @typedef {number & {__brand:"RoomID"}} RoomID
 * @typedef {import("../../utils/repository.js").Repo<RoomID, Room>} RoomRepo
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
    return RepoM.spawn_element(repo, {
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
    const room = OptM.unwrap(RepoM.get(repo, id));
    if (Object.keys(room.exits).includes(name)) throw new Error(`exit name already used for this room: ${room.id} ${name}`);
    room.exits[name] = exit;
    SBM.emit(UISBM.BUS, "room_modified");
}

/**
 * passer par méthodes du World à la place
 * @param {RoomRepo} repo 
 * @param {RoomID} id
 * @param {EntityID} entity_id
 */
export function add_entity(repo, id, entity_id) {
    const room = OptM.unwrap(RepoM.get(repo, id));
    if (room.entities.includes(entity_id)) throw new Error(`entity_id already in this room: ${room.id} ${entity_id}`);
    room.entities.push(entity_id);
    SBM.emit(UISBM.BUS, "room_modified");
}
/**
 * passer par méthodes du World à la place
 * @param {RoomRepo} repo 
 * @param {RoomID} id
 * @param {EntityID} entity_id
 */
export function remove_entity(repo, id, entity_id) {
    const room = OptM.unwrap(RepoM.get(repo, id));
    if (!room.entities.includes(entity_id)) throw new Error(`entity_id is not in this room: ${room.id} ${entity_id}`);
    room.entities = room.entities.filter(e => e != entity_id);
    SBM.emit(UISBM.BUS, "room_modified");
}

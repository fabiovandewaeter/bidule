// engine/map/room.js
// @ts-check

import '../../utils/types.js'
import * as Opt from '../../utils/option.js'
import * as Repo from '../../utils/repository.js'

/**@typedef {'city'|'river'|'forest'|'mountain'} RoomType */
/** @typedef {number & {__brand:"RoomID"}} RoomID*/
/**
 * @typedef {Object} Room
 * @property {RoomID} id
 * @property {RoomType} type
 * @property {Record<string, RoomExit>} exits // "north", "portal"
 */

/**
 * Un seul sens
 * @typedef {Object} RoomExit
 * @property {RoomID} target
 */

/**
 * @param {RoomRepo} repo
 * @param {RoomType} type
 * @returns {Room}
 */
export function spawn(repo, type) {
    return Repo.spawn_element(repo, {
        type,
        exits: {}
    });
}

// je vois pas pourquoi on aurait besoin de ce cas et pas juste tester si c'est dedans comme pour les autres noms de sorties
// /**
//  * @param {Room} room 
//  * @param {Direction} direction 
//  * @returns {Opt<D<RoomExit>>}
//  */
// export function get_exit_from_direction(room, direction) {
//     if (Object.keys(room.exits).includes(direction)) return Opt.some(room.exits[direction]);
//     return Opt.none;
// }

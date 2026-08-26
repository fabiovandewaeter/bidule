// engine/entity/player.js
//@ts-check

import '../../utils/types.js'
import * as Opt from '../../utils/option.js'
import * as Repo from '../../utils/repository.js'
import * as Entity from './entity.js'

/** @type {EntityID} */
export const ID = /**@type {EntityID}*/(0);

/** 
 * @typedef {Entity & {
 * }} Player
 */

/**
 * @param {EntityRepo} repo
 * @param {string} name
 * @param {RoomID} room_id
 * @param {GroupID} [group_id] 
 * @returns {Entity}
 */
export function spawn(repo, name, room_id, group_id) {
    const player = Entity.spawn(repo, name, room_id, group_id);
    // ajouter autres données
    return player;
}

/**
 * @param {EntityRepo} repo
 * @returns {Player}
 */
export function get(repo) { return /**@type {Player} */(Opt.expect(Repo.get(repo, ID), "couldn't find player in entity repo")); }

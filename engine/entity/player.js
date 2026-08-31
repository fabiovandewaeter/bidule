// engine/entity/player.js
// @ts-check

/**
 * @typedef {import("./entity.js").Entity} Entity
 * @typedef {import("./entity.js").EntityID} EntityID
 * @typedef {import("./entity.js").EntityRepo} EntityRepo
 * @typedef {import("./faction.js").FactionID} FactionID
 * @typedef {import("../map/room.js").RoomID} RoomID
 */
import "../../utils/types.js"
import * as OptM from "../../utils/option.js";
import * as RepoM from "../../utils/repository.js";
import * as EntityM from "./entity.js";

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
 * @param {FactionID} [faction_id] 
 * @returns {Entity}
 */
export function spawn(repo, name, room_id, faction_id) {
    const player = EntityM.spawn(repo, name, room_id, faction_id);
    // ajouter autres données
    return player;
}

/**
 * @param {EntityRepo} repo
 * @returns {Player}
 */
export function get(repo) { return /**@type {Player} */(OptM.expect(RepoM.get(repo, ID), "couldn't find player in entity repo")); }

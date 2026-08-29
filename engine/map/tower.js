// engine/tower/tower.js
// @ts-check

/**
 * @typedef {import("./floor.js").FloorRepo} FloorRepo
 * @typedef {import("./zone.js").ZoneRepo} ZoneRepo
 * @typedef {import("./area.js").AreaRepo} AreaRepo
 * @typedef {import("./region.js").RegionID} RegionID
 * @typedef {import("./region.js").RegionRepo} RegionRepo
 * @typedef {import("./room.js").RoomID} RoomID
 * @typedef {import("./room.js").RoomRepo} RoomRepo
 */
import "../../utils/types.js"
import * as RoomM from "./room.js"
import * as RepoM from "../../utils/repository.js"

// Tower > Floor> Region > Zone > Area > Room

export const DEFAULT_ROOM_ID = /**@type {RoomID} */ (0);

/**
 * @typedef {Object} Tower
 * @property {RegionID[]} regions
 * @property {FloorRepo} floor_repo
 * @property {RegionRepo} region_repo
 * @property {ZoneRepo} zone_repo
 * @property {AreaRepo} area_repo
 * @property {RoomRepo} room_repo
 */

/**
 * @returns {Tower}
 */
export function create() {
    return {
        regions: [],
        floor_repo: RepoM.create(),
        region_repo: RepoM.create(),
        zone_repo: RepoM.create(),
        area_repo: RepoM.create(),
        room_repo: RepoM.create(),
    };
}

/**
 * @param {Tower} tower 
 */
export function init(tower) {
    const default_room = RepoM.spawn_element(tower.room_repo, {
        type: "city",
        name: "DEFAULT",
        exits: {},
        entities: [],
    });
    // TODO: enlever ça faire une système plus propre
    if (default_room.id != DEFAULT_ROOM_ID) throw new Error(`default_room_id different from DEFAULT_ROOM_ID: ${default_room.id} ${DEFAULT_ROOM_ID}`)
    const seconde_room = RepoM.spawn_element(tower.room_repo, {
        type: "forest",
        name: "seconde_room",
        exits: {},
        entities: [],
    });
    RoomM.add_exit(tower.room_repo, default_room.id, "sortie foret", {
        target_id: seconde_room.id
    });
    RoomM.add_exit(tower.room_repo, seconde_room.id, "room default", {
        target_id: default_room.id
    });
}

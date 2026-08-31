// engine/map/floor.js
// @ts-check

/**
 * @typedef {import("./region.js").RegionID} RegionID 
 */
import "../../utils/types.js"
import * as RepoM from "../../utils/repository.js";

/**
 * @typedef {Object} Floor
 * @property {FloorID} id
 * @property {string} name
 * @property {RegionID[]} regions
 * 
 * @typedef {number & {__brand:"FloorID"}} FloorID
 * @typedef {import("../../utils/repository.js").Repo<FloorID, Floor>} FloorRepo
 */

/**
 * @param {FloorRepo} repo
 * @param {string} name
 * @returns {Floor}
 */
export function spawn(repo, name) {
    return RepoM.spawn_element(/**@type {FloorRepo}*/(repo), {
        name,
        regions: []
    });
}

// /**
//  * @param {D<Floor>} continent
//  * @param {AreaID} id
//  * @returns {D<Floor>}
//  */
// export function add_area(continent, id) { return { ...continent, areas: [...continent.areas, id] }; }

// /**
//  * @param {D<Floor>} continent
//  * @param {AreaID} id
//  * @returns {D<Floor>}
//  */
// export function remove_area(continent, id) { return { ...continent, areas: continent.areas.filter(old_id => old_id === id ? id : old_id) }; }

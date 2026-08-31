// engine/map/region.js
// @ts-check

/**
 * @typedef {import("./zone.js").ZoneID} ZoneID
 */
import "../../utils/types.js"
import * as RepoM from "../../utils/repository.js";

/**
 * @typedef {Object} Region
 * @property {RegionID} id
 * @property {string} name
 * @property {ZoneID[]} zones
 * 
 * @typedef {number & {__brand:"RegionID"}} RegionID
 * @typedef {import("../../utils/repository.js").Repo<RegionID, Region>} RegionRepo
 */

/**
 * @param {RegionRepo} repo
 * @param {string} name
 * @returns {Region}
 */
export function spawn(repo, name) {
    return RepoM.spawn_element(/**@type {RegionRepo}*/(repo), {
        name,
        zones: []
    });
}

// /**
//  * @param {D<Region>} continent
//  * @param {AreaID} id
//  * @returns {D<Region>}
//  */
// export function add_area(continent, id) { return { ...continent, areas: [...continent.areas, id] }; }

// /**
//  * @param {D<Region>} continent
//  * @param {AreaID} id
//  * @returns {D<Region>}
//  */
// export function remove_area(continent, id) { return { ...continent, areas: continent.areas.filter(old_id => old_id === id ? id : old_id) }; }

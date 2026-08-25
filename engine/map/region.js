// engine/map/region.js
// @ts-check

import '../../utils/types.js'
import * as Repo from '../../utils/repository.js'

/** @typedef {number & {__brand:"RegionID"}} RegionID*/
/**
 * @typedef {Object} Region
 * @property {RegionID} id
 * @property {string} name
 * @property {ZoneID[]} zones
 */

/**
 * @param {RegionRepo} repo
 * @param {string} name
 * @returns {Region}
 */
export function spawn(repo, name) {
    return Repo.spawn_element(/**@type {RegionRepo}*/(repo), {
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

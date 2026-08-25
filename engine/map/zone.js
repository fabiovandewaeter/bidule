// engine/map/zone.js
// @ts-check

import '../../utils/types.js'
import * as Repo from '../../utils/repository.js'

/** @typedef {number & {__brand:"ZoneID"}} ZoneID*/
/**
 * @typedef {Object} Zone
 * @property {RegionID} id
 * @property {string} name
 * @property {AreaID[]} areas
 */

/**
 * @param {ZoneRepo} repo
 * @param {string} name
 * @returns {Zone}
 */
export function spawn(repo, name) {
    return Repo.spawn_element(/**@type {ZoneRepo}*/(repo), {
        name,
        areas: []
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

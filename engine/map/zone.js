// engine/map/zone.js
// @ts-check

/**
 * @typedef {import('./region.js').RegionID} RegionID
 * @typedef {import('./area.js').AreaID} AreaID
 */
import '../../utils/types.js'
import * as RepoM from '../../utils/repository.js'

/**
 * @typedef {Object} Zone
 * @property {RegionID} id
 * @property {string} name
 * @property {AreaID[]} areas
 * 
 * @typedef {number & {__brand:"ZoneID"}} ZoneID
 * @typedef {import('../../utils/repository.js').Repo<ZoneID, Zone>} ZoneRepo
 */

/**
 * @param {ZoneRepo} repo
 * @param {string} name
 * @returns {Zone}
 */
export function spawn(repo, name) {
    return RepoM.spawn_element(/**@type {ZoneRepo}*/(repo), {
        name,
        areas: []
    });
}

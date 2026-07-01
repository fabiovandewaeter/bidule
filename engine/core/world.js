// engine/core/world.js
//@ts-check

import '../../utils/types.js'
import * as Clock from './clock.js'
import * as Repo from '../../utils/repository.js'
import * as Opt from '../../utils/option.js'
import * as Res from '../../utils/result.js'

/**
 * @typedef {Object} World
 * @property {Clock} clock
 */

/**
 * @returns {World}
 */
export function create() {
    return {
        clock: Clock.create(null),
    };
}

/**
 * @param {World} world 
 * @returns {World}
 */
export function init(world) {
    return {
        ...world,
    };
}

/**
 * @param {World} world
 * @param {number} delta_ms
 */
export function update(world, delta_ms) {
    // TODO: update la clock aussi ? ou faire dehors je sais pas
}

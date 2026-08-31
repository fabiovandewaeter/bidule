// engine/combat/tag/effectiveness.js
// @ts-check

/**
 * @typedef {import("./tag.js").Tag} Tag
 * @typedef {import("./tag.js").TagKey} TagKey
 * @typedef {import("../../item/material.js").MaterialKey} MaterialKey
 */

const NO_EFFECT = 0.0;
const MOSTLY_INEFFECTIVE = 0.25;
const NOT_VERY_EFFECTIVE = 0.5;
const NORMAL = 1.0;
const EFFECTIVE = 1.5;
const SUPER_EFFECTIVE = 2.0;
const EXTREME_EFFECTIVE = 4.0;

/**
 * // TODO: voir si on fait un truc comme ça ou alors dans effets pour avoir fireresistance
 * @example
 * {tag: "FIRE", multiplier: NOT_VERY_EFFECTIVE} pour ne pas avoir à faire un enum géant
 * 
 * @template {Tag} T
 * @typedef {{tag: T, multiplier: number}} Resistance
 */

/**
 * table[attaquant][défenseur] = multiplicateur, sans préciser c'est efficacite NORMAL
 * @type {Record<TagKey, Partial<Record<TagKey, number>>>}
 */
export const EFFECTIVENESS = Object.freeze(/**@type {const}*/({
    SLASHING: { FRAGILE: EFFECTIVE, WATER: NO_EFFECT, DEVIATING: NOT_VERY_EFFECTIVE },
    FIRE: { ICE: SUPER_EFFECTIVE, WATER: MOSTLY_INEFFECTIVE, VOID: NO_EFFECT },
    LAVA: { ICE: EXTREME_EFFECTIVE, FRAGILE: EXTREME_EFFECTIVE, VOID: NO_EFFECT },
    LIGHT: { VOID: EXTREME_EFFECTIVE },
}));

/**
 * @param {TagKey} attack
 * @param {TagKey} defense
 * @returns {number}
 */
export function get_effectiveness(attack, defense) {
    return EFFECTIVENESS[attack]?.[defense] ?? NORMAL;
}

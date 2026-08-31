// engine/combat/tag/tag.js
// @ts-check

/**
 * @typedef {Object} TagDefinition
 * @property {string} name
 */

/** @satisfies {Record<string, TagDefinition>} */
export const OFFENSIVE_TAGS = Object.freeze(/**@type {const}*/({
    SLASHING: { name: "slashing" }
}));
/**
 * @typedef {EnumValue<typeof OFFENSIVE_TAGS>} OffensiveTag
 * @typedef {EnumKey<typeof OFFENSIVE_TAGS>} OffensiveKey
 */

/** @satisfies {Record<string, TagDefinition>} */
export const ELEMENT_TAGS = Object.freeze(/**@type {const}*/({
    FIRE: { name: "fire" },
    LAVA: { name: "lava" },
    VOID: { name: "void" },
    LIGHT: { name: "light" },
}));
/**
 * @typedef {EnumValue<typeof ELEMENT_TAGS>} ElementTag
 * @typedef {EnumKey<typeof ELEMENT_TAGS>} ElementKey
 */

// TODO/ voir si void: ou "void": par exemple pour pouvoir faire ELEMENT_TAGS["FIRE"].effectiveness["void"]

export const MAGIC_TAGS = Object.freeze({
});
/**@typedef {EnumValue<typeof MAGIC_TAGS>} MagicTag*/

/** @satisfies {Record<string, TagDefinition>} */
export const DEFENSIVE_TAGS = Object.freeze(/**@type {const}*/({
    DENSE: { name: "dense" },
    REFLECTING: { name: "reflecting" },
    DEVIATING: { name: "deviating" },
}));
/**
 * @typedef {EnumValue<typeof DEFENSIVE_TAGS>} DefensiveTag
 * @typedef {EnumKey<typeof DEFENSIVE_TAGS>} DefensiveKey
 */

/**
 * @typedef {OffensiveTag|MagicTag|ElementKey|DefensiveTag} Tag
 * @typedef {OffensiveKey|MagicTag|ElementKey|DefensiveKey} TagKey
 */

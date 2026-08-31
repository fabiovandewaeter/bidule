// engine/item/material.js
// @ts-check

// TODO: ajouter types de bois, de métaux etc.
/**
 * @typedef {import("../combat/tag/tag.js").TagKey} TagKey
 */

/**
 * @typedef {Object} MaterialDefinition
 * @property {string} name
 * @property {number} multiplier
 * @property {MaterialCategoryKey[]} categories
 * @property {TagKey[]} tags
 */

/** @satisfies {Record<string, MaterialDefinition>} */
export const MATERIALS = Object.freeze(/**@type {const}*/({
    IRON: { name: "Fer", multiplier: 1.0, categories: ["METAL"], tags: [] },
    STEEL: { name: "Acier", multiplier: 1.2, categories: ["METAL"], tags: [] },
    DRAGON_IRON: { name: "Fer dragonique", multiplier: 1.8, categories: ["METAL"], tags: ["FIRE"] },
    DIAMOND: { name: "Diamant", multiplier: 2.0, categories: ["GEM"], tags: ["DENSE"] },
    MYTHRIL: { name: "Mithril", multiplier: 1.5, categories: ["METAL"], tags: ["LIGHT"] },
    OBSIDIAN: { name: "Obsidienne", multiplier: 1.3, categories: ["STONE", "GEM"], tags: ["LAVA"] },
}));
/** 
 * @typedef {EnumKey<typeof MATERIALS>} MaterialKey
 * @typedef {EnumValue<typeof MATERIALS>} Material
 */

export const MATERIAL_CATEGORIES = Object.freeze(/**@type {const}*/({
    METAL: { name: "metal" },
    STONE: { name: "stone" },
    GEM: { name: "gem" },
    LEATHER: { name: "leather" },
    WOOD: { name: "wood" },
    VEGETAL: { name: "vegetal" },
}));
/**
 * @typedef {EnumKey<typeof MATERIAL_CATEGORIES>} MaterialCategoryKey
 * @typedef {EnumValue<typeof MATERIAL_CATEGORIES>} MaterialCategory
 */

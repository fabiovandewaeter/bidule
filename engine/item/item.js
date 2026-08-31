// engine/item/item.js
// @ts-check

// TODO: runes/enchantements/modules qui changent les tags et les effets

/**
 * @typedef {import("./quality.js").QualityKey} QualityKey
 * @typedef {import("./material.js").MaterialKey} MaterialKey
 * @typedef {import("../utils/gauge.js").Gauge} Gauge
 */

/**
 * @typedef {Object} Item
 * @property {ItemType} type
 * @property {MaterialKey} material_key
 * @property {QualityKey} quality_key
 * @property {Opt<Gauge>} durability
 */

export const ITEM_TYPES = Object.freeze(/**@type {const}*/{
    SWORD: { name: "Sword" },
});
/** 
 * @typedef {EnumKey<typeof ITEM_TYPES>} ItemTypeKey
 * @typedef {EnumValue<typeof ITEM_TYPES>} ItemType
 */

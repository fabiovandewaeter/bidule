// engine/item/item.js
//@ts-check

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

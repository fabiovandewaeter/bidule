// engine/combat/stat.js
// @ts-check

/**
 * @typedef {import("../utils/gauge.js").Gauge} Gauge
 */
import * as GaugeM from "../utils/gauge.js";

/**
 * @typedef {{
 *   [K in StatTypeKey]:
 *     typeof STAT_TYPES[K]["category"] extends "gauge"
 *       ? { key: K, gauge: Gauge }
 *       : { key: K, value: number }
 * }[StatTypeKey]} Stat
 */

/**
 * @typedef {Object} StatDefinition
 * @property {string} name
 * @property {"gauge"|"value"} category
 */

/** @satisfies {Record<string, StatDefinition>} */
export const STAT_TYPES = Object.freeze(/**@type {const}*/({
    HP: { name: "HP", category: "gauge" },
    MANA: { name: "Mana", category: "gauge" },
    DEFENSE: { name: "Defense", category: "value" },
    ATTACK: { name: "Attaque", category: "value" },
}));
/** 
 * @typedef {EnumKey<typeof STAT_TYPES>} StatTypeKey
 * @typedef {EnumValue<typeof STAT_TYPES>} StatType
 */

/**
 * @param {number} max
 * @returns {Stat}
 */
export function HP(max) { return { key: "HP", gauge: GaugeM.create(max) }; }
/**
 * @param {number} max
 * @returns {Stat}
 */
export function Mana(max) { return { key: "MANA", gauge: GaugeM.create(max) }; }
/**
 * @param {number} amount
 * @returns {Stat}
 */
export function Defense(amount) { return { key: "DEFENSE", value: amount }; }
/**
 * @param {number} amount
 * @returns {Stat}
 */
export function Attack(amount) { return { key: "ATTACK", value: amount }; }

// engine/item/slot.js
// @ts-check

/**
 * @typedef {import("./material.js").MaterialCategoryKey} MaterialCategoryKey
 */

/**
 * @typedef {Object} SlotDefinition
 * @property {string} name
 * @property {MaterialCategoryKey[]} accepts
 * @property {TagKey[]} grants
 */

/** @satisfies {Record<string, SlotDefinition>} */
// export const SLOTS = Object.freeze(/**@type {const}*/({
//     BLADE: { name: "blade", accepts: ["METAL", "GEM"] },
//     HILT: { name: "hilt", accepts: ["METAL", "WOOD"] },
//     GRIP: { name: "grip", accepts: ["WOOD", "LEATHER", "METAL"] },
//     HEAD: { name: "head", accepts: ["METAL", "STONE"] },
//     SHAFT: { name: "shaft", accepts: ["WOOD", "METAL"] },
// }));
export const SLOTS = Object.freeze(/**@type {const}*/({
    BLADE: { name: "lame", accepts: ["METAL", "GEM"], grants: ["SLASHING"] },
    POINT: { name: "pointe", accepts: ["METAL"], grants: ["PIERCING"] },
    HEAD: { name: "tête", accepts: ["METAL", "STONE"], grants: ["BLUNT"] },
    HILT: { name: "garde", accepts: ["METAL", "WOOD"], grants: [] },
    GRIP: { name: "poignée", accepts: ["WOOD", "LEATHER", "METAL"], grants: [] },
    SHAFT: { name: "manche", accepts: ["WOOD", "METAL"], grants: [] },
}));
/**
 * @typedef {EnumKey<typeof SLOTS>} SlotKey
 * @typedef {EnumValue<typeof SLOTS>} Slot
 */

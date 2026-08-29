// engine/item/material.js
//@ts-check

export const MATERIALS = Object.freeze(/**@type {const}*/{
    IRON: { name: "Fer", multiplier: 1.0, tags: [] },
    STEEL: { name: "Acier", multiplier: 1.2, tags: ["durable"] },
    MYTHRIL: { name: "Mithril", multiplier: 1.5, tags: ["light", "magical"] },
});
/** 
 * @typedef {EnumKey<typeof MATERIALS>} MaterialKey
 * @typedef {EnumValue<typeof MATERIALS>} Material
 */

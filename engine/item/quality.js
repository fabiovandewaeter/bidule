// engine/item/quality.js
//@ts-check

export const QUALITIES = Object.freeze(/**@type {const}*/({
    POOR: { name: "poor", multiplier: 0.8 },
    NORMAL: { name: "normal", multiplier: 1.0 },
    PERFECT: { name: "perfect", multiplier: 1.3 },
}));
/** 
 * @typedef {EnumKey<typeof QUALITIES>} QualityKey
 * @typedef {EnumValue<typeof QUALITIES>} Quality
 */

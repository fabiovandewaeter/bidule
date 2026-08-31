// engine/combat/tag/proc.js
// @ts-check

/**
 * @typedef {import("./tag.js").Tag} Tag
 * @typedef {import("./tag.js").TagKey} TagKey
 * @typedef {import("../status.js").Status} Status
 * @typedef {import("../../item/material.js").MaterialKey} MaterialKey
 */

/**
 * @typedef {Object} TagProcEffectDefinition
 * @property {Status} status
 */

/**
 * Procs déclenchés lors d'un coup avec un tag offensif.
 * Format : { onHit?: AtomicEffect[] }
 * Ces effets seront exécutés après les dégâts.
 * @satisfies {Record<string, TagProcEffectDefinition>}
 */
//  * @type {Partial<Record<TagKey, { onHit?: import("../effects.js").AtomicEffect[] }>>}
export const TAG_PROC_EFFECTS = Object.freeze(/**@type {const}*/{
    SLASHING: {
        onHit: [
            { type: "APPLY_STATUS", status: { type: "BLEaEDING", stacks: 1, duration: 3 } }
        ]
    },
    FIRE: {
        onHit: [
            { type: "APPLY_STATUS", status: { type: "BURN", stacks: 1, duration: 2 } }
        ]
    },
});

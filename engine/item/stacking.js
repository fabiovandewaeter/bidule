// engine/item/stacking.js
//@ts-check

import * as UtilsM from "../../utils/utils.js"

/**
 * @typedef {Object} ItemStack
 * @property {Item} item
 * @property {number} quantity
 */

/** 
 * @param {Item} a
 * @param {Item} b
 * @returns {boolean}
 */
export function is_same_item(a, b) {
    return UtilsM.data_key(a) === UtilsM.data_key(b.data);  // même qualité/matériaux/durabilité = fusion
}

/** 
 * @param {ItemStack} a
 * @param {ItemStack} b
 * @returns {boolean}
 */
export function can_merge(a, b) {
    if (a.itemId !== b.itemId) return false;
    const def = ITEM_DEFINITIONS[a.itemId];
    if (def.maxStack <= 1) return false;        // épées etc: jamais fusionnables
    return UtilsM.data_key(a.data) === UtilsM.data_key(b.data);  // même qualité/matériaux/durabilité = fusion
}

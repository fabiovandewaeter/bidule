// engine/item/inventory.js
//@ts-check

/**
 * @typedef {Object} Inventory
 * @property {ItemStack[]} stacked_items
 * @property {InstancedItemID[]} instanced_items
 */

/**
 * @returns {Inventory}
 */
export function create() {
    return {
        stacked_items: [],
        instanced_items: []
    };
}

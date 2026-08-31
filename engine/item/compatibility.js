// engine/item/compatibility.js
// @ts-check

/**
 * @typedef {import("./slot.js").SlotKey} SlotKey
 * @typedef {import("./material.js").MaterialKey} MaterialKey
 * @typedef {import("./material.js").MaterialCategoryKey} MaterialCategoryKey
 */
import { SLOTS } from "./slot.js";
import { MATERIALS } from "./material.js";
import * as EnumM from "../../utils/enum.js";

/**
 * @param {SlotKey} slot_key
 * @param {MaterialKey} material_key 
 * @returns {boolean}
 */
export function are_slot_and_material_compatible(slot_key, material_key) {
    return SLOTS[slot_key].accepts.some(category =>
        MATERIALS[material_key].categories.some(c => c === category)
    );
}

/**
 * La requête la plus fréquente (slot -> matériaux valides), résolue à la volée.
 * @param {SlotKey} slot_key
 * @returns {MaterialKey[]}
 */
export function materials_for_slot(slot_key) {
    /** @type {MaterialKey[]} */
    const res = [];
    const material_keys = EnumM.keys(MATERIALS);
    for (const key of material_keys) {
        if (are_slot_and_material_compatible(slot_key, key)) {
            res.push(key);
        }
    }
    return res;
}

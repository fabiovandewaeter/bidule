// utils/enum.js
//@ts-check

/**
 * Vérifie si une valeur appartient aux valeurs d'un objet "enum".
 * @template {Record<string, unknown>} T
 * @param {T} enum_obj
 * @param {string} value 
 * @returns {value is T[keyof T]}
 */
export function is_enum_value(enum_obj, value) { return Object.values(enum_obj).includes(/** @type {T[keyof T]} */(value)); }
/**
 * Vérifie si une valeur appartient aux valeurs d'un objet "enum".
 * @template {Record<string, unknown>} T
 * @param {T} enum_obj
 * @param {string} key
 * @returns {key is keyof T & string}
 */
export function is_enum_key(enum_obj, key) { return Object.keys(enum_obj).includes(key); }

// /**
//  * @template {readonly string[]} T
//  * @param {T} keys
//  * @returns {Readonly<{ [K in T[number]]: Lowercase<K> }>}
//  */
// function create_string_enum(keys) {
//     const result = /** @type {Record<string, string>} */ ({});
//     for (const k of keys) {
//         result[k] = k.toLowerCase();
//     }
//     return /** @type {Readonly<{ [K in T[number]]: Lowercase<K> }>} */ (Object.freeze(result));
// }
// const ACTIONS = create_string_enum(
//     /** @type {const} */([
//         "SKIP_SECONDS",
//         "TOGGLE_TICK",
//         "SWITCH_SCENE",
//         "DOWNLOAD_SAVE",
//         "UPLOAD_SAVE",
//         "CLEAR_SAVE",
//     ])
// );
// /** @typedef {typeof ACTIONS[keyof typeof ACTIONS]} Action */

// utils/utils.js
//@ts-check

/**
 * pour convertir un string en number ou TID par exemple
 * @template {number} RType
 * @param {string|undefined} id_string
 * @returns {RType}
 */
export function string_to_rtype(id_string) {
    if (!id_string) throw new Error();
    const id = Number(id_string);
    if (!Number.isSafeInteger(id) || id < 0) throw new Error;
    return  /**@type {RType}*/(id);
}
/**
 * Vérifie si une valeur appartient aux valeurs d'un objet "enum" à valeurs chaînes.
 * @template {Record<string, string>} T
 * @param {T} enum_obj
 * @param {string} value 
 * @returns {value is T[keyof T]}
 */
export function is_enum_value(enum_obj, value) { return Object.values(enum_obj).includes(/** @type {T[keyof T]} */(value)) }

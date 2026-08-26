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

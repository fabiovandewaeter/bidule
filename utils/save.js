// utils/save.js
// @ts-check
const STORAGE_KEY = 'machin_save';

import './types.js'
import * as Opt from './option.js'

/**
 * @typedef {Object} SaveStruct
 * @property {boolean} is_initialized
 * @property {World} world
 * @property {UIState} ui
 */

/**
 * @param {World} world
 * @param {UIState} ui
 */
export function save(world, ui) {
    const save_struct = { ui, world };
    try {
        const json = JSON.stringify(save_struct);
        localStorage.setItem(STORAGE_KEY, json);
    } catch (e) {
        console.error('Could not save:', e);
    }
}

/**
 * @returns {Opt<SaveStruct>}
 */
export function load() {
    try {
        const json = localStorage.getItem(STORAGE_KEY);
        if (json) {
            const res = JSON.parse(json);
            res.is_initialized = true;
            return Opt.some(res);
        }
        return Opt.none;
    } catch (e) {
        console.error('Could not load save:', e);
        localStorage.removeItem(STORAGE_KEY);
        return Opt.none;
    }
}

export function clear() {
    console.log(localStorage.getItem(STORAGE_KEY));
    localStorage.removeItem(STORAGE_KEY);
    console.log(localStorage.getItem(STORAGE_KEY));
}

/**
 * @param {World} world
 * @param {UIState} ui
 */
export function download(world, ui) {
    const save_struct = { world, ui };
    const json = JSON.stringify(save_struct, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'save.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function upload() {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const target = e.target;
            if (!(target instanceof HTMLInputElement)) throw new Error();
            const file = target.files?.[0];
            if (!file) {
                resolve(null);
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const model = JSON.parse(/**@type {string}*/(event.target?.result));
                    // TODO: valider que les champs sont bons
                    resolve(model);
                } catch (err) {
                    console.error('Fichier invalide');
                    resolve(null);
                }
            };
            reader.onerror = () => resolve(null);
            reader.readAsText(file);
        };
        input.click();
    });
}

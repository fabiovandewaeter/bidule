// ui/scenes/scene.js
// @ts-check

import * as MainScene from './main_scene.js'
import * as MenuScene from './menu_scene.js'
import * as Store from '../core/store.js'
import * as Opt from '../../utils/option.js'
import * as UISB from '../core/signals.js'
import * as SB from '../../utils/signal_bus.js'

/** @type {Opt<() => void>} */
let current_destroy = Opt.none;

export const SCENES = Object.freeze({
    MAIN: 'main',
    MENU: 'menu',
});
/**
 * @typedef {typeof SCENES[keyof typeof SCENES]} Scene
 */

export function init() {
    SB.on(UISB.BUS, 'scene_switched', () => {
        const app = document.getElementById('app');
        if (app) render_current_scene(app);
    });
}

/**
 * @param {string} value 
 * @returns {value is Scene}
 */
export function is_valid_scene(value) { return Object.values(SCENES).includes(/** @type {Scene} */(value)) }

/**
 * @param {HTMLElement} app
 */
export function render_current_scene(app) {
    if (Opt.is_some(current_destroy)) {
        current_destroy.value();
        current_destroy = Opt.none;
    }
    app.innerHTML = '';
    const store = Store.get();
    switch (store.ui_state.scene) {
        case 'main':
            current_destroy = Opt.some(MainScene.mount(app));
            break;
        case 'menu':
            current_destroy = Opt.some(MenuScene.mount(app));
            break;
    }
}

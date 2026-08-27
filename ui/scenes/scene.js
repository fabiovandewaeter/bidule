// ui/scenes/scene.js
// @ts-check

import * as MainScene from './main_scene.js'
import * as MenuScene from './menu_scene.js'
import * as Store from '../core/store.js'
import * as Opt from '../../utils/option.js'
import * as UISB from '../core/signals.js'
import * as SB from '../../utils/signal_bus.js'
/**
 * @typedef {import('../components/comp.js').DestroyFunction} DestroyFunction
 */

// TODO: voir si on garde ça en global
/** @type {Opt<DestroyFunction>} */
let current_destroy = Opt.none;

export const SCENES = Object.freeze({
    MAIN: 'main',
    MENU: 'menu',
});
/** @typedef {EnumValue<typeof SCENES>} Scene */

export function init() {
    SB.on(UISB.BUS, 'scene_switched', () => {
        const app = document.getElementById('app');
        if (app) render_current_scene(app);
    });
}

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
        case SCENES.MAIN:
            current_destroy = Opt.some(MainScene.mount(app).destroy);
            break;
        case SCENES.MENU:
            current_destroy = Opt.some(MenuScene.mount(app).destroy);
            break;
    }
}

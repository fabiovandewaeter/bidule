// ui/scene/scene.js
// @ts-check

import * as MainSceneM from "./main_scene.js"
import * as MenuSceneM from "./menu_scene.js"
import * as StoreM from "../core/store.js"
import * as OptM from "../../utils/option.js"
import * as UISBM from "../core/signals.js"
import * as SBM from "../../utils/signal_bus.js"
/**
 * @typedef {import("../component/comp.js").DestroyFunction} DestroyFunction
 */

// TODO: voir si on garde ça en global
/** @type {Opt<DestroyFunction>} */
let current_destroy = OptM.none;

export const SCENES = Object.freeze(/**@type {const}*/({
    MAIN: "main",
    MENU: "menu",
}));
/** @typedef {EnumValue<typeof SCENES>} Scene */

export function init() {
    SBM.on(UISBM.BUS, "scene_switched", () => {
        const app = document.getElementById("app");
        if (app) render_current_scene(app);
    });
}

/**
 * @param {HTMLElement} app
 */
export function render_current_scene(app) {
    if (OptM.is_some(current_destroy)) {
        current_destroy.value();
        current_destroy = OptM.none;
    }
    app.innerHTML = "";
    const store = StoreM.get();
    switch (store.ui_state.scene) {
        case SCENES.MAIN:
            current_destroy = OptM.some(MainSceneM.mount(app).destroy);
            break;
        case SCENES.MENU:
            current_destroy = OptM.some(MenuSceneM.mount(app).destroy);
            break;
    }
}

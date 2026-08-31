// ui/scene/main_scene.js
// @ts-check

/**
 * @typedef {import("../component/comp.js").DestroyFunction} DestroyFunction
 * @typedef {import("../component/sub_comp_manager.js").SubCompKey} SubCompKey
 * @typedef {import("../../engine/entity/entity.js").EntityID} EntityID
 */
import "../../utils/types.js"
import * as TimeCM from "../component/time_comp.js";
import * as ControlCM from "../component/controls_comp.js";
import * as RoomCM from "../component/room_comp.js";
import * as MenuCM from "../component/menu_comp.js";
import * as LogCM from "../component/logs_comp.js";
import * as CompM from "../component/comp.js";
import * as EntityCM from "../component/entity_comp.js";
import * as SCMM from "../component/sub_comp_manager.js";
import * as UISBM from "../core/signals.js";
import * as SBM from "../../utils/signal_bus.js";

/**@type {SubCompKey} */
const ENTITY_PANEL_KEY = "entity_panel";

/**
 * @returns {string}
 */
export function render() {
    return `
<div class="scene-left"> </div>
<div class="scene-right"> </div>
    `;
}

/**
 * @param {HTMLElement} container
 * @returns {{element: HTMLElement, destroy: DestroyFunction }}
 */
export function mount(container) {
    return CompM.create_comp_with_sub_comps(container, "scene-main", (el, sub_comps, add_cleanup) => {
        el.innerHTML = render();

        const left = /**@type {HTMLElement}*/(el.querySelector(".scene-left"));
        const right = /**@type {HTMLElement}*/(el.querySelector(".scene-right"));

        SCMM.add(sub_comps, "time", TimeCM.mount(left));
        SCMM.add(sub_comps, "controls", ControlCM.mount(left));
        SCMM.add(sub_comps, "room", RoomCM.mount(left));
        SCMM.add(sub_comps, "menu", MenuCM.mount(left));
        SCMM.add(sub_comps, "logs", LogCM.mount(left));

        const on_show_entity_menu = (/**@type {EntityID} */entity_id) => {
            SCMM.remove(sub_comps, ENTITY_PANEL_KEY); // no-op si absent
            SCMM.add(sub_comps, ENTITY_PANEL_KEY, EntityCM.mount(right, entity_id));
        };
        add_cleanup(SBM.on(UISBM.BUS, "open_entity_panel", on_show_entity_menu));

        const on_close_entity_menu = () => { SCMM.remove(sub_comps, ENTITY_PANEL_KEY); };
        add_cleanup(SBM.on(UISBM.BUS, "close_entity_panel", on_close_entity_menu));
    });
}

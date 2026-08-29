// ui/component/controls_comp.js
// @ts-check

/**
 * @typedef {import("./comp.js").DestroyFunction} DestroyFunction
 */
import "../../utils/types.js"
import { SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, SECONDS_PER_WEEK, SECONDS_PER_YEAR } from "../../utils/const.js"
import * as SBM from "../../utils/signal_bus.js"
import * as UISBM from "../core/signals.js"
import * as StoreM from "../core/store.js"
import * as WorldM from "../../engine/core/world.js"
import * as UIStateM from "../core/ui_state.js"
import * as SceneM from "../scene/scene.js"
import * as SaveM from "../../utils/save.js"
import * as CompM from "./comp.js"
import * as RuntimeM from "../core/runtime.js"
import * as UtilsM from "../../utils/utils.js"
import * as EnumM from "../../utils/enum.js"

const TICK_DELAY_MS = 1000;

const ACTIONS = Object.freeze({
    SKIP_SECONDS: "skip_seconds",
    TOGGLE_TICK: "toggle_tick",
    SWITCH_SCENE: "switch_scene",
    DOWNLOAD_SAVE: "download_save",
    UPLOAD_SAVE: "upload_save",
    CLEAR_SAVE: "clear_save",
});
/**@typedef {EnumValue<typeof ACTIONS>} Action*/

/**
 * @returns {string}
 */
export function render() {
    return `
<div class="controls-time">
    <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${TICK_DELAY_MS}>1 seconde</button>
    <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${SECONDS_PER_MINUTE * TICK_DELAY_MS}>1 minute</button>
    <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${SECONDS_PER_HOUR * TICK_DELAY_MS}>1 heure</button>
    <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${SECONDS_PER_DAY * TICK_DELAY_MS}>1 jour</button>
    <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${SECONDS_PER_WEEK * TICK_DELAY_MS}>1 semaine</button>
    <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${SECONDS_PER_YEAR * TICK_DELAY_MS}>1 an</button>
</div>

<button data-action="${ACTIONS.TOGGLE_TICK}">Start</button>
<button data-action="${ACTIONS.SWITCH_SCENE}" data-scene="${SceneM.SCENES.MENU}">Switch to menu</button>

<div class="controls-save">
    <button data-action="${ACTIONS.DOWNLOAD_SAVE}">download save</button>
    <button data-action="${ACTIONS.UPLOAD_SAVE}">upload save</button>
    <button data-action="${ACTIONS.CLEAR_SAVE}">clear save</button>
</div>
    `;
}

/**
 * @param {HTMLElement} el 
 */
function update_toggle_button(el) {
    const s = StoreM.get();
    const button = el.querySelector(`button[data-action="${ACTIONS.TOGGLE_TICK}"]`);
    if (!button) throw new Error();
    button.textContent = s.ui_state.tick_interval_id === null ? "Start" : "Stop";
};

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: DestroyFunction }}
 */
export function mount(container) {
    return CompM.create_comp(container, "controls-comp", (el, add_cleanup) => {
        el.innerHTML = render();

        // TODO: PAS BESOIN de addEventListener ni removeEventListener car on a Comp.delegate_click()
        // el.addEventListener("click", handle_click);
        add_cleanup(CompM.delegate_click(el, (action, event, btn) => {
            if (!EnumM.is_enum_value(ACTIONS, action)) throw new Error();
            handle_action(action, btn);
        }));

        add_cleanup(SBM.on(UISBM.BUS, "toggle_tick", () => update_toggle_button(el)));
        update_toggle_button(el);
    });
}

/**
 * @param {Action} action
 * @param {HTMLElement} btn
 */
function handle_action(action, btn) {
    const s = StoreM.get();
    switch (action) {
        case ACTIONS.SKIP_SECONDS: {
            const ms = UtilsM.string_to_rtype(btn.dataset.amount);
            WorldM.advance_by(s.world, ms);
            SBM.emit(UISBM.BUS, "tick");
            // save_timestamp(clock.timestamp);
            UIStateM.add_log(s.ui_state, `skip_seconds: ${ms} ms`);
            break;
        }
        case ACTIONS.TOGGLE_TICK: {
            const s = StoreM.get();
            if (s.ui_state.tick_interval_id !== null) {
                clearInterval(s.ui_state.tick_interval_id);
                s.ui_state.tick_interval_id = null;
            }
            else {
                s.ui_state.tick_interval_id = setInterval(() => {
                    const s = StoreM.get();
                    WorldM.advance_by(s.world, TICK_DELAY_MS);
                    SBM.emit(UISBM.BUS, "tick");
                    UIStateM.add_log(s.ui_state, "tick");
                }, TICK_DELAY_MS);
            }
            SBM.emit(UISBM.BUS, "toggle_tick");
            UIStateM.add_log(s.ui_state, "toggle_tick");
            break;
        }
        case ACTIONS.SWITCH_SCENE: {
            const new_scene = btn.dataset.scene;
            if (new_scene) {
                if (!EnumM.is_enum_value(SceneM.SCENES, new_scene)) { throw new Error(`Invalid scene: ${new_scene}`); }
                s.ui_state.scene = new_scene;
                UIStateM.add_log(s.ui_state, `switch_scene: ${new_scene}`);
                SBM.emit(UISBM.BUS, "scene_switched", new_scene);
            }
            break;
        }
        case ACTIONS.DOWNLOAD_SAVE: {
            SaveM.download(s.world, s.ui_state);
            break;
        }
        case ACTIONS.UPLOAD_SAVE: {
            SaveM.upload().then((loaded => {
                if (loaded && loaded.world) {
                    WorldM.advance_to(loaded.world, Date.now());
                    StoreM.set_world(loaded.world);
                    SBM.emit(UISBM.BUS, "scene_switched", s.ui_state.scene);
                }
            }));
            break;
        }
        case ACTIONS.CLEAR_SAVE: {
            UIStateM.stop_tick(s.ui_state);
            SaveM.clear();
            RuntimeM.init();
            break;
        };
        // case "hide_logs": {
        // TODO: si on le remet il faut mettre dans le parent le on() et pas dans le logs_comp directement
        //     SB.emit(UISB.BUS, "toggle_logs")
        //     break;
        // };
        default: throw new Error(action);
    }
};

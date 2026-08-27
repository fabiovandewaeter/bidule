// ui/components/controls_comp.js
// @ts-check

import '../../utils/types.js'
import { SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, SECONDS_PER_WEEK, SECONDS_PER_YEAR } from '../../utils/const.js'
import * as SB from '../../utils/signal_bus.js'
import * as UISB from '../core/signals.js'
import * as Store from '../core/store.js'
import * as World from '../../engine/core/world.js'
import * as UIState from '../core/ui_state.js'
import * as Scene from '../scenes/scene.js'
import * as Save from '../../utils/save.js'
import * as Comp from './comp.js'
import * as Runtime from '../core/runtime.js'
import * as Utils from '../../utils/utils.js'
/**
 * @typedef {import('./comp.js').DestroyFunction} DestroyFunction
 */

const TICK_DELAY_MS = 1000;

const ACTIONS = Object.freeze({
    SKIP_SECONDS: 'skip_seconds',
    TOGGLE_TICK: 'toggle_tick',
    SWITCH_SCENE: 'switch_scene',
    DOWNLOAD_SAVE: 'download_save',
    UPLOAD_SAVE: 'upload_save',
    CLEAR_SAVE: 'clear_save',
});
/**@typedef {EnumValue<typeof ACTIONS>} Action*/

/**
 * @returns {string}
 */
export function render() {
    return `
    <div class="controls-comp">
        <div class="controls-time">
            <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${1 * TICK_DELAY_MS}>1 seconde</button>
            <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${SECONDS_PER_MINUTE * TICK_DELAY_MS}>1 minute</button>
            <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${SECONDS_PER_HOUR * TICK_DELAY_MS}>1 heure</button>
            <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${SECONDS_PER_DAY * TICK_DELAY_MS}>1 jour</button>
            <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${SECONDS_PER_WEEK * TICK_DELAY_MS}>1 semaine</button>
            <button data-action="${ACTIONS.SKIP_SECONDS}" data-amount=${SECONDS_PER_YEAR * TICK_DELAY_MS}>1 an</button>
        </div>

        <button data-action="${ACTIONS.TOGGLE_TICK}">Start</button>
        <button data-action="${ACTIONS.SWITCH_SCENE}" data-scene="${Scene.SCENES.MENU}">Switch to menu</button>

        <div class="controls-save">
            <button data-action="${ACTIONS.DOWNLOAD_SAVE}">download save</button>
            <button data-action="${ACTIONS.UPLOAD_SAVE}">upload save</button>
            <button data-action="${ACTIONS.CLEAR_SAVE}">clear save</button>
        </div>
    </div>
    `;
}

/**
 * @param {HTMLElement} el 
 */
function update_toggle_button(el) {
    const s = Store.get();
    const button = el.querySelector(`button[data-action="${ACTIONS.TOGGLE_TICK}"]`);
    if (!button) throw new Error();
    button.textContent = s.ui_state.tick_interval_id === null ? "Start" : "Stop";
};

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: DestroyFunction }}
 */
export function mount(container) {
    return Comp.create_comp(container, (el, add_cleanup) => {
        el.innerHTML = render();

        // TODO: PAS BESOIN de addEventListener ni removeEventListener car on a Comp.delegate_click()
        // el.addEventListener('click', handle_click);
        add_cleanup(Comp.delegate_click(el, (action, event, btn) => {
            if (!Utils.is_enum_value(ACTIONS, action)) throw new Error();
            handle_action(action, btn);
        }));

        add_cleanup(SB.on(UISB.BUS, 'toggle_tick', () => update_toggle_button(el)));
        update_toggle_button(el);
    });
}

/**
 * @param {Action} action
 * @param {HTMLElement} btn
 */
function handle_action(action, btn) {
    const s = Store.get();
    switch (action) {
        case ACTIONS.SKIP_SECONDS: {
            const ms = Utils.string_to_rtype(btn.dataset.amount);
            World.advance_by(s.world, ms);
            SB.emit(UISB.BUS, 'tick');
            // save_timestamp(clock.timestamp);
            UIState.add_log(s.ui_state, `skip_seconds: ${ms} ms`);
            break;
        }
        case ACTIONS.TOGGLE_TICK: {
            const s = Store.get();
            if (s.ui_state.tick_interval_id !== null) {
                clearInterval(s.ui_state.tick_interval_id);
                s.ui_state.tick_interval_id = null;
            }
            else {
                s.ui_state.tick_interval_id = setInterval(() => {
                    const s = Store.get();
                    World.advance_by(s.world, TICK_DELAY_MS);
                    SB.emit(UISB.BUS, 'tick');
                    UIState.add_log(s.ui_state, 'tick');
                }, TICK_DELAY_MS);
            }
            SB.emit(UISB.BUS, 'toggle_tick');
            UIState.add_log(s.ui_state, 'toggle_tick');
            break;
        }
        case ACTIONS.SWITCH_SCENE: {
            const new_scene = btn.dataset.scene;
            if (new_scene) {
                if (!Utils.is_enum_value(Scene.SCENES, new_scene)) { throw new Error(`Invalid scene: ${new_scene}`); }
                s.ui_state.scene = new_scene;
                UIState.add_log(s.ui_state, `switch_scene: ${new_scene}`);
                SB.emit(UISB.BUS, 'scene_switched', new_scene);
            }
            break;
        }
        case ACTIONS.DOWNLOAD_SAVE: {
            Save.download(s.world, s.ui_state);
            break;
        }
        case ACTIONS.UPLOAD_SAVE: {
            Save.upload().then((loaded => {
                if (loaded && loaded.world) {
                    World.advance_to(loaded.world, Date.now());
                    Store.set_world(loaded.world);
                    SB.emit(UISB.BUS, 'scene_switched', s.ui_state.scene);
                }
            }));
            break;
        }
        case ACTIONS.CLEAR_SAVE: {
            UIState.stop_tick(s.ui_state);
            Save.clear();
            Runtime.init();
            break;
        };
        // case 'hide_logs': {
        // TODO: si on le remet il faut mettre dans le parent le on() et pas dans le logs_comp directement
        //     SB.emit(UISB.BUS, 'toggle_logs')
        //     break;
        // };
        default: throw new Error(action);
    }
};

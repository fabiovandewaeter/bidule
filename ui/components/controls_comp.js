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
import * as Repo from '../../utils/repository.js'

const TICK_DELAY_MS = 1000;

/**
 * @returns {string}
 */
export function render() {
    return `
    <div class="controls-comp">
        <div class="controls-time">
            <button data-action="skip_seconds" data-amount=1000>1 seconde</button>
            <button data-action="skip_seconds" data-amount=${SECONDS_PER_MINUTE * TICK_DELAY_MS}>1 minute</button>
            <button data-action="skip_seconds" data-amount=${SECONDS_PER_HOUR * TICK_DELAY_MS}>1 heure</button>
            <button data-action="skip_seconds" data-amount=${SECONDS_PER_DAY * TICK_DELAY_MS}>1 jour</button>
            <button data-action="skip_seconds" data-amount=${SECONDS_PER_WEEK * TICK_DELAY_MS}>1 semaine</button>
            <button data-action="skip_seconds" data-amount=${SECONDS_PER_YEAR * TICK_DELAY_MS}>1 an</button>
        </div>

        <button data-action="toggle_tick">Start</button>
        <button data-action="switch_scene" data-scene="menu">Switch to menu</button>

        <div class="controls-save">
            <button data-action="download_save">download save</button>
            <button data-action="upload_save">upload save</button>
            <button data-action="clear_save">clear save</button>
        </div>
    </div>
    `;
}

/**
 * @param {HTMLElement} el 
 */
function update_toggle_button(el) {
    const s = Store.get();
    const button = el.querySelector('button[data-action="toggle_tick"]');
    if (!button) throw new Error();
    button.textContent = s.ui_state.tick_interval_id === null ? "Start" : "Stop";
};

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: () => void }}
 */
export function mount(container) {
    return Comp.create_comp(container, (el, add_cleanup) => {
        el.innerHTML = render();

        // TODO: PAS BESOIN de addEventListener ni removeEventListener car on a Comp.delegate_click()
        // el.addEventListener('click', handle_click);
        add_cleanup(Comp.delegate_click(el, (action, event, btn) => {
            handle_action(action, btn);
        }));

        add_cleanup(SB.on(UISB.BUS, 'toggle_tick', () => update_toggle_button(el)));
        update_toggle_button(el);
    });
}

/**
 * @param {string} action
 * @param {HTMLElement} btn
 */
function handle_action(action, btn) {
    const s = Store.get();
    switch (action) {
        case 'skip_seconds': {
            // const ms = Number(btn.dataset.ms);
            // if (!Number.isSafeInteger(ms)) throw new Error();
            const ms = Repo.string_to_id(btn.dataset.amount);
            World.advance_by(s.world, ms);
            SB.emit(UISB.BUS, 'tick');
            // save_timestamp(clock.timestamp);
            UIState.add_log(s.ui_state, `skip_seconds: ${ms} ms`);
            break;
        }
        case 'toggle_tick': {
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
        case 'switch_scene': {
            const new_scene = btn.dataset.scene;
            if (new_scene) {
                if (!Scene.is_valid_scene(new_scene)) { throw new Error(`Invalid scene: ${new_scene}`); }
                s.ui_state.scene = new_scene;
                UIState.add_log(s.ui_state, `switch_scene: ${new_scene}`);
                SB.emit(UISB.BUS, 'scene_switched', new_scene);
            }
            break;
        }
        case 'download_save': {
            Save.download(s.world, s.ui_state);
            break;
        }
        case 'upload_save': {
            Save.upload().then((loaded => {
                if (loaded && loaded.world) {
                    World.advance_to(loaded.world, Date.now());
                    Store.set_world(loaded.world);
                    SB.emit(UISB.BUS, 'scene_switched', s.ui_state.scene);
                }
            }));
            break;
        }
        case 'clear_save': {
            UIState.stop_tick(s.ui_state);
            Save.clear();
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

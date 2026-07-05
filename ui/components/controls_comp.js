// ui/components/controls_comp.js
// @ts-check

import '../../utils/types.js'
import { SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, SECONDS_PER_WEEK, SECONDS_PER_YEAR } from '../../utils/const.js'
import { EB } from '../../utils/event_bus.js';
import * as Store from '../core/store.js'
import * as Clock from '../../engine/core/clock.js'
import * as World from '../../engine/core/world.js'
import * as UIState from '../core/ui_state.js'
import * as Scene from '../scenes/scene.js'
import * as Save from '../../utils/save.js'

const TICK_DELAY_MS = 1000;

/**
 * @returns {string}
 */
export function render() {
    return `
    <div class="controls-comp">
        <div class="controls-time">
            <button data-action="skip_seconds" data-amount=1000>1 seconde</button>
            <button data-action="skip_seconds" data-amount=${SECONDS_PER_MINUTE * 1000}>1 minute</button>
            <button data-action="skip_seconds" data-amount=${SECONDS_PER_HOUR * 1000}>1 heure</button>
            <button data-action="skip_seconds" data-amount=${SECONDS_PER_DAY * 1000}>1 jour</button>
            <button data-action="skip_seconds" data-amount=${SECONDS_PER_WEEK * 1000}>1 semaine</button>
            <button data-action="skip_seconds" data-amount=${SECONDS_PER_YEAR * 1000}>1 an</button>
        </div>

        <button data-action="toggle_tick">Start</button>
        <button data-action="switch_scene" data-scene="menu">Switch to menu</button>
        <button data-action="hide_logs">Hide logs</button>

        <div class="controls-save">
            <button data-action="download_save">download save</button>
            <button data-action="upload_save">upload save</button>
            <button data-action="clear_save">clear save</button>
        </div>
    </div>
    `;
}

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: () => void }}
 */
export function mount(container) {
    const el = document.createElement('div');
    el.innerHTML = render();

    // {
    //     name: 'hide_logs', handler: () => {
    //     }
    // },

    // @ts-ignore
    const handle_click = (event) => {
        const btn = event.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        const s = Store.get_store();

        switch (action) {
            case 'skip_seconds': {
                const ms = parseInt(btn.dataset.amount || '0', 10);
                Clock.advance_clock_by(s.world.clock, ms);
                World.update(s.world, ms);
                // TODO: faut append dans le render
                // save_timestamp(clock.timestamp);
                UIState.add_log(s.ui_state, `skip_seconds: ${ms} ms`);
                break;
            }
            case 'toggle_tick': {
                const s = Store.get_store();
                if (s.ui_state.tick_interval_id !== null) {
                    clearInterval(s.ui_state.tick_interval_id);
                    s.ui_state.tick_interval_id = null;
                }
                else {
                    s.ui_state.tick_interval_id = setInterval(() => {
                        const s = Store.get_store();
                        const delta_ms = Clock.tick(s.world.clock);
                        World.update(s.world, delta_ms);
                        EB.emit('tick');
                    }, TICK_DELAY_MS);
                    s.world.clock.last_tick_timestamp = Date.now();
                }
                EB.emit('toggle_tick');
                UIState.add_log(s.ui_state, 'toggle_tick');
                break;
            }
            case 'switch_scene': {
                const new_scene = btn.dataset.scene;
                if (new_scene) {
                    // UIState.set_scene(new_scene);
                    if (!Scene.is_valid_scene(new_scene)) { throw new Error(`Invalid scene: ${new_scene}`); }
                    s.ui_state.scene = new_scene;
                    UIState.add_log(s.ui_state, `switch_scene: ${new_scene}`);
                    // Scene.unregister_actions(ACTIONS);
                    EB.emit('scene_switched', new_scene);
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
                        Store.set_world(loaded.world);
                        s.world.clock.last_tick_timestamp = Date.now();
                        EB.emit('scene_switched', s.ui_state.scene);
                    }
                }));
                break;
            }
            case 'clear_save': {
                Save.clear();
                break;
            };
            default: throw new Error(action);
        }
    };

    el.addEventListener('click', handle_click);

    const update_toggle_button = () => {
        const s = Store.get_store();
        const button = el.querySelector('button[data-action="toggle_tick"]');
        if (!button) throw new Error();
        if (s.ui_state.tick_interval_id === null) {
            button.textContent = "Start";
        }
        else {
            button.textContent = "Stop";
        }
    };

    const off_toggle = EB.on('toggle_tick', update_toggle_button);
    update_toggle_button();

    const destroy = () => {
        el.removeEventListener('click', handle_click);
        off_toggle();
        el.remove();
    };

    container.appendChild(el);
    return { element: el, destroy };
}

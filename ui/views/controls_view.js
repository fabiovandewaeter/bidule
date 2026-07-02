// ui/views/controls_view.js
// @ts-check

import '../../utils/types.js'
import { SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, SECONDS_PER_WEEK, SECONDS_PER_YEAR } from '../../utils/const.js'
import { EB } from '../core/runtime.js';

/**
 * @param {World} world 
 * @param {UIState} ui_state 
 * @returns {string}
 */
export function render(world, ui_state) {
    const res = `
    <div class="controls-view">
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

        <div class="controls-save">
            <button data-action="download_save">download save</button>
            <button data-action="upload_save">upload save</button>
            <button data-action="clear_save">clear save</button>
        </div>
    </div>
    `;

    EB.on('toggle_tick', () => update_all(world, ui_state));

    return res;
}

/**
 * @param {World} world 
 * @param {UIState} ui_state 
 */
export function update_all(world, ui_state) {
    document.querySelectorAll('.controls-view').forEach(
        control => {
            const button = control.querySelector('[data-action="toggle_tick"]');
            if (!button) throw new Error();
            if (ui_state.tick_interval_id === null) {
                button.textContent = "Start";
            }
            else {
                button.textContent = "Stop";
            }
        }
    )
}

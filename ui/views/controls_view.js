// ui/views/controls_view.js
// @ts-check

import '../../utils/types.js'
import { SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, SECONDS_PER_WEEK, SECONDS_PER_YEAR } from '../../utils/const.js'

/**
 * @returns {string}
 */
export function render() {
    return `
    <div class="controls-view">
        <div class="controls-time">
            <button data-msg-type="skip_seconds" data-amount=1000>1 seconde</button>
            <button data-msg-type="skip_seconds" data-amount=${SECONDS_PER_MINUTE * 1000}>1 minute</button>
            <button data-msg-type="skip_seconds" data-amount=${SECONDS_PER_HOUR * 1000}>1 heure</button>
            <button data-msg-type="skip_seconds" data-amount=${SECONDS_PER_DAY * 1000}>1 jour</button>
            <button data-msg-type="skip_seconds" data-amount=${SECONDS_PER_WEEK * 1000}>1 semaine</button>
            <button data-msg-type="skip_seconds" data-amount=${SECONDS_PER_YEAR * 1000}>1 an</button>
        </div>

        <button data-msg-type="start_stop_tick_interval">Start</button>

        <button data-msg-type="stop_main">Stop main</button>

        <div class="controls-save">
            <button data-msg-type="download_save">download save</button>
            <button data-msg-type="upload_save">upload save</button>
            <button data-msg-type="clear_save">clear save</button>
        </div>
    </div>
    `;
}

/**
 * @param {Model|null} prev
 * @param {Model} next
 */
export function update_all(prev, next) {
    if (prev?.tick_interval_id === next.tick_interval_id) return;

    document.querySelectorAll('.controls-view').forEach(
        control => {
            const button = control.querySelector('[data-msg-type="start_stop_tick_interval"]');
            if (!button) throw new Error();
            if (next.tick_interval_id === null) {
                button.textContent = "Start";
            }
            else {
                button.textContent = "Stop";
            }
        }
    )
}

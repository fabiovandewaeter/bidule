// ui/components/time_comp.js
// @ts-check

import '../../utils/types.js'
import { SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, SECONDS_PER_WEEK, SECONDS_PER_YEAR } from '../../utils/const.js'
import { EB } from '../../utils/event_bus.js';
import * as Store from '../core/store.js'

/**
 * @returns {string}
 */
export function render() {
    const res = `
    <div class="time-comp">
        <h1>Temps passé: </h1>
        <span class="time-seconds">0</span> secondes
        <span class="time-minutes">0</span> minutes
        <span class="time-hours">0</span> heures
        <span class="time-days">0</span> jours
        <span class="time-weeks">0</span> semaines
        <span class="time-years">0</span> années
    </div>
    `;

    // update_all();
    // EB.on('tick', update_all);
    return res;
}

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: () => void }}
 */
export function mount(container) {
    const el = document.createElement('div');
    el.innerHTML = render();

    const update = () => {
        let store = Store.get_store();
        const accumulated_seconds = store.world.clock.accumulated_time / 1000;

        const s_counter = el.querySelector('.time-seconds');
        const m_counter = el.querySelector('.time-minutes');
        const h_counter = el.querySelector('.time-hours');
        const d_counter = el.querySelector('.time-days');
        const w_counter = el.querySelector('.time-weeks');
        const y_counter = el.querySelector('.time-years');

        if (!s_counter || !m_counter || !h_counter || !d_counter || !w_counter || !y_counter) throw new Error();

        s_counter.textContent = Math.floor(accumulated_seconds).toString();
        m_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_MINUTE).toString();
        h_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_HOUR).toString();
        d_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_DAY).toString();
        w_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_WEEK).toString();
        y_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_YEAR).toString();
    }

    const off = EB.on('tick', update);
    update();

    const destroy = () => {
        off();
        el.remove();
    };

    container.appendChild(el);
    return { element: el, destroy };
}

export function update_all() {
    let store = Store.get_store();
    const accumulated_seconds = store.world.clock.accumulated_time / 1000;
    document.querySelectorAll('.time-comp').forEach(
        time => {
            const s_counter = time.querySelector('.time-seconds');
            const m_counter = time.querySelector('.time-minutes');
            const h_counter = time.querySelector('.time-hours');
            const d_counter = time.querySelector('.time-days');
            const w_counter = time.querySelector('.time-weeks');
            const y_counter = time.querySelector('.time-years');

            if (!s_counter || !m_counter || !h_counter || !d_counter || !w_counter || !y_counter) throw new Error();

            s_counter.textContent = Math.floor(accumulated_seconds).toString();
            m_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_MINUTE).toString();
            h_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_HOUR).toString();
            d_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_DAY).toString();
            w_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_WEEK).toString();
            y_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_YEAR).toString();
        }
    );
}

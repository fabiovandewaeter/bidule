// ui/components/time_comp.js
// @ts-check

import '../../utils/types.js'
import { SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, SECONDS_PER_WEEK, SECONDS_PER_YEAR } from '../../utils/const.js'
import * as UISB from '../core/signals.js'
import * as SB from '../../utils/signal_bus.js'
import * as Store from '../core/store.js'
import * as Clock from '../../engine/core/clock.js'

/**
 * @returns {string}
 */
export function render() {
    return `
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
}

/**
 * @param {GameStore} store
 * @returns {number} temps simulé écoulé depuis la création du monde, en ms
 */
function get_accumulated_seconds(store) { return Clock.get_elapsed_ms(store.world.clock) / 1000; }

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: () => void }}
 */
export function mount(container) {
    const el = document.createElement('div');
    el.innerHTML = render();

    const update = () => {
        let store = Store.get();
        const accumulated_seconds = get_accumulated_seconds(store);

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

    const off = SB.on(UISB.BUS, 'tick', update);
    update();

    const destroy = () => {
        off();
        el.remove();
    };

    container.appendChild(el);
    return { element: el, destroy };
}

export function update_all() {
    let store = Store.get();
    const accumulated_seconds = get_accumulated_seconds(store);
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

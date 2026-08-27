// ui/components/time_comp.js
// @ts-check

/**
 * @typedef {import('./comp.js').DestroyFunction} DestroyFunction
 * @typedef {import('../core/store.js').GameStore} GameStore
 */
import '../../utils/types.js'
import { SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, SECONDS_PER_WEEK, SECONDS_PER_YEAR } from '../../utils/const.js'
import * as UISBM from '../core/signals.js'
import * as SBM from '../../utils/signal_bus.js'
import * as StoreM from '../core/store.js'
import * as ClockM from '../../engine/core/clock.js'
import * as CompM from './comp.js'

/**
 * @returns {string}
 */
export function render() {
    return `
<h1>Temps passé: </h1>
<span class="time-seconds">0</span> secondes
<span class="time-minutes">0</span> minutes
<span class="time-hours">0</span> heures
<span class="time-days">0</span> jours
<span class="time-weeks">0</span> semaines
<span class="time-years">0</span> années
    `;
}

/**
 * @param {GameStore} store
 * @returns {number} temps simulé écoulé depuis la création du monde, en ms
 */
function get_accumulated_seconds(store) { return ClockM.get_elapsed_ms(store.world.clock) / 1000; }

/**
 * @param {HTMLElement} el
 */
export function update(el) {
    let s = StoreM.get();
    const accumulated_seconds = get_accumulated_seconds(s);

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

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: DestroyFunction }}
 */
export function mount(container) {
    return CompM.create_comp(container, 'time-comp', (el, add_cleanup) => {
        el.innerHTML = render();

        add_cleanup(SBM.on(UISBM.BUS, 'tick', () => update(el)));
        update(el);
    });
}

// export function update_all() {
//     let store = Store.get();
//     const accumulated_seconds = get_accumulated_seconds(store);
//     document.querySelectorAll('.time-comp').forEach(
//         time => {
//             const s_counter = time.querySelector('.time-seconds');
//             const m_counter = time.querySelector('.time-minutes');
//             const h_counter = time.querySelector('.time-hours');
//             const d_counter = time.querySelector('.time-days');
//             const w_counter = time.querySelector('.time-weeks');
//             const y_counter = time.querySelector('.time-years');

//             if (!s_counter || !m_counter || !h_counter || !d_counter || !w_counter || !y_counter) throw new Error();

//             s_counter.textContent = Math.floor(accumulated_seconds).toString();
//             m_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_MINUTE).toString();
//             h_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_HOUR).toString();
//             d_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_DAY).toString();
//             w_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_WEEK).toString();
//             y_counter.textContent = Math.floor(accumulated_seconds / SECONDS_PER_YEAR).toString();
//         }
//     );
// }

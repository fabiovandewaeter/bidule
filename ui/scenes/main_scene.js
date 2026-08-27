// ui/scenes/main_scene.js
// @ts-check

import '../../utils/types.js'
import * as TimeC from '../components/time_comp.js'
import * as ControlC from '../components/controls_comp.js'
import * as RoomC from '../components/room_comp.js'
import * as MenuC from '../components/menu_comp.js'
import * as LogC from '../components/logs_comp.js'
import * as Comp from '../components/comp.js'
import * as EntityC from '../components/entity_comp.js'
import * as SCM from '../components/sub_comp_manager.js'
import * as UISB from '../core/signals.js'
import * as SB from '../../utils/signal_bus.js'
/**
 * @typedef {import('../components/comp.js').DestroyFunction} DestroyFunction
 */

/**@type {SubCompKey} */
const ENTITY_PANEL_KEY = 'entity_panel';

/**
 * @returns {string}
 */
export function render() {
    return `
    <div class="scene-main">
        <div class="scene-left"> </div>
        <div class="scene-right"> </div>
    </div>
    `;
}

/**
 * @param {HTMLElement} container
 * @returns {{element: HTMLElement, destroy: DestroyFunction }}
 */
export function mount(container) {
    return Comp.create_comp_with_sub_comps(container, (el, sub_comps, add_cleanup) => {
        el.innerHTML = render();

        const left = /**@type {HTMLElement}*/(el.querySelector('.scene-left'));
        const right = /**@type {HTMLElement}*/(el.querySelector('.scene-right'));

        SCM.add(sub_comps, 'time', TimeC.mount(container));
        SCM.add(sub_comps, 'controls', ControlC.mount(container));
        SCM.add(sub_comps, 'room', RoomC.mount(container));
        SCM.add(sub_comps, 'menu', MenuC.mount(container));
        SCM.add(sub_comps, 'logs', LogC.mount(container));

        const on_show_entity_menu = (/**@type {EntityID} */entity_id) => {
            SCM.remove(sub_comps, ENTITY_PANEL_KEY); // no-op si absent
            SCM.add(sub_comps, ENTITY_PANEL_KEY, EntityC.mount(right, entity_id));
        };
        add_cleanup(SB.on(UISB.BUS, 'open_entity_panel', on_show_entity_menu));

        const on_close_entity_menu = () => { SCM.remove(sub_comps, ENTITY_PANEL_KEY); };
        add_cleanup(SB.on(UISB.BUS, 'close_entity_panel', on_close_entity_menu));
    });
}

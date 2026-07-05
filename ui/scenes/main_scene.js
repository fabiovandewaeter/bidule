// ui/scenes/main_scene.js
// @ts-check

import '../../utils/types.js'
import * as Time from '../components/time_comp.js'
import * as Control from '../components/controls_comp.js'
import * as Log from '../components/logs_comp.js'
import * as Menu from '../components/menu_comp.js'

/**
 * @param {HTMLElement} container
 * @returns {() => void}
 */
export function mount(container) {
    container.innerHTML += '';

    const mounts = [
        Time.mount(container),
        Control.mount(container),
        Log.mount(container),
        Menu.mount(container),
    ];

    const destroy = () => {
        mounts.forEach(m => m.destroy());
    };

    return destroy;
}

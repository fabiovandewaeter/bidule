// ui/scenes/main_scene.js
// @ts-check

import '../../utils/types.js';
import * as Subscribers from '../core/view/subscribers.js';
import * as Time from '../views/time_view.js';
import * as Control from '../views/controls_view.js';
import * as Log from '../views/logs_view.js';
import { EB } from '../../utils/event_bus.js';

/**
 * @param {HTMLElement} container
 * @param {Model} model
 */
export function render(container, model) {
    container.innerHTML += `
    <h1>Scene: Main</h1>
    ${Time.render()}
    ${Control.render()}
    ${Log.render()}
    `;

    // Subscribers.subscribe('times', Time.update_all);
    EB.on('tick', Time.update_all);
    Subscribers.subscribe('controls', Control.update_all);
    Subscribers.subscribe('logs', Log.update_all);
}

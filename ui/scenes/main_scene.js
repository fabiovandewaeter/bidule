// ui/scenes/main_scene.js
// @ts-check

import '../../utils/types.js'
import * as Time from '../views/time_view.js'
import * as Control from '../views/controls_view.js'
import * as Log from '../views/logs_view.js'
import * as Action from '../core/action.js'
import * as Clock from '../../engine/core/clock.js'
import * as World from '../../engine/core/world.js'
import * as UIState from '../core/ui_state.js'
import * as Save from '../../utils/save.js'
import * as Runtime from '../core/runtime.js'
import * as Scene from './scene.js'
import * as Store from '../core/store.js'

const TICK_DELAY_MS = 1000;

/**
 * @param {HTMLElement} container
 */
export function render(container) {
    const store = Store.get_store();

    container.innerHTML += `
    <h1>Scene: Main</h1>
    ${Time.render(store.world, store.ui_state)}
    ${Control.render(store.world, store.ui_state)}
    ${Log.render(store.world, store.ui_state)}
    `;

    // TODO: pour l'instant on laisse en update_all et dans la scene car si les components sont détruits
    // TODO: ça marche pas en fait car je ne sais pas à l'avance quels components il va y avoir

    // Subscribers.subscribe('times', Time.update_all);
    EB.on('tick', () => Time.update_all(world, ui_state));
    // Subscribers.subscribe('controls', Control.update_all);
    EB.on('toggle_tick', () => Control.update_all(world, ui_state));
    // Subscribers.subscribe('logs', Log.update_all);
    EB.on('logs', () => Log.update_all(world, ui_state));

    Scene.register_actions(ACTIONS);
}

/** @type {Action[]} */
const ACTIONS = [
    {
        name: 'toggle_tick', handler: () => {
            let tick_interval_id = UI_STATE.tick_interval_id;
            if (tick_interval_id !== null) {
                clearInterval(tick_interval_id);
                tick_interval_id = null;
            }
            else {
                tick_interval_id = setInterval(() => {
                    const delta_ms = Clock.tick(WORLD.clock);
                    World.update(WORLD, delta_ms);
                    EB.emit('tick');
                }, TICK_DELAY_MS);
            }

            UI_STATE.tick_interval_id = tick_interval_id;
            WORLD.clock.last_tick_timestamp = Date.now();
            EB.emit('toggle_tick');
            UIState.add_log(UI_STATE, 'toggle_tick');
        }
    },
    {
        // @ts-ignore
        name: 'skip_seconds', handler: ({ element }) => {
            const ms = parseInt(element.dataset.amount || '0', 10);
            Clock.advance_clock_by(WORLD.clock, ms);
            World.update(WORLD, ms);
            // TODO: faut append dans le render
            // save_timestamp(clock.timestamp);
            UIState.add_log(UI_STATE, `skip_seconds: ${ms} ms`);
        }
    },
    {
        // @ts-ignore
        name: 'switch_scene', handler: ({ element }) => {
            const new_scene = element.dataset.scene;
            if (new_scene) {
                // UIState.set_scene(new_scene);
                if (!Scene.is_valid_scene(new_scene)) { throw new Error(`Invalid scene: ${new_scene}`); }
                UI_STATE.scene = new_scene;
                UIState.add_log(UI_STATE, `switch_scene: ${new_scene}`);
                Scene.unregister_actions(ACTIONS);
                EB.emit('scene_switched', new_scene);
            }
        }
    },
    { name: 'download_save', handler: () => { Save.download(WORLD, UI_STATE); } },
    {
        name: 'upload_save', handler: () => {
            Save.upload().then((loaded => {
                if (loaded) {
                    Runtime.set_world(loaded);
                    WORLD.clock.last_tick_timestamp = Date.now();
                }
            }));
        }
    },
    { name: 'clear_save', handler: () => { Save.clear(); } },
];

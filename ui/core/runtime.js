// ui/core/runtime.js
// @ts-check

import * as World from '../../engine/core/world.js'
import * as Save from '../../utils/save.js'
import * as Action from './action.js'
import * as UIState from './ui_state.js'
import * as Opt from '../../utils/option.js'
import * as Clock from '../../engine/core/clock.js'
import * as EventBus from '../../utils/event_bus.js'
import * as MenuScene from '../scenes/menu_scene.js'
import * as MainScene from '../scenes/main_scene.js'
import * as Scene from '../scenes/scene.js'
import * as Store from './store.js'

init();

function init() {
    const app = /**@type {HTMLElement}*/(document.getElementById('app'));
    app.tabIndex = -1
    app.focus();

    // let world, ui_state;
    const saved_opt = Save.load();
    if (Opt.is_some(saved_opt)) {
        let { world, ui_state } = saved_opt.value;
        if (world) {
            const now = Date.now();
            const delta = now - world.clock.last_tick_timestamp;
            if (delta > 0) {
                Clock.advance_clock_by(world.clock, delta);
                World.update(world, delta);
            }
            world.clock.last_tick_timestamp = now;
            Store.set_world(world);
        } else {
            const new_world = World.create();
            World.init(new_world);
            Store.set_world(new_world);
        }
        Store.set_ui_state(ui_state || UIState.create());
    } else {
        const new_world = World.create();
        World.init(new_world);
        Store.set_world(new_world);
        Store.set_ui_state(UIState.create());
    }

    // attache les events listeners au app pour qu'ils ne soient jamais détruit par un innerHTML
    add_event_listener_click(app);
    add_event_listener_keydown(app);

    // init_actions();
    Scene.render_current_scene(app);

    // EB.on('scene_switched', () => Scene.render_current_scene(app, world, ui_state));
    window.addEventListener('beforeunload', () => {
        const store = Store.get_store();
        if (store.should_save) Save.save(store.world, store.ui_state);
    })
    window.addEventListener('pagehide', () => {
        const store = Store.get_store();
        if (store.should_save) Save.save(store.world, store.ui_state);
    })
}

/**
 * @param {World} world
 * @returns {World}
 */
function load_world(world) {
    const now = Date.now();
    const delta = now - world.clock.last_tick_timestamp;
    if (delta > 0) {
        Clock.advance_clock_by(world.clock, delta);
        World.update(world, delta);
    }
    world.clock.last_tick_timestamp = now;
    return world;
}

/**
 * @param {HTMLElement} app 
 */
function add_event_listener_click(app) {
    app.addEventListener('click', (event) => {
        const target = /** @type {HTMLElement | null} */ (event.target);
        const action_el = /** @type {HTMLElement | null} */ (target?.closest('[data-action]'));
        if (!action_el) return;
        const action_name = action_el.dataset.action;
        if (!action_name) return;
        // @ts-ignore
        const handler = Action.get(action_name);
        if (Opt.is_some(handler)) {
            handler.value({ element: action_el, event });
        }

        // // const target = /** @type {HTMLElement | null} */ (el?.closest('[data-action]'));
        // if (!target) return;

        // const msg_type = target.dataset.msgType;
        // switch (msg_type) {
        //     case 'start_stop_tick_interval':
        //     case 'start_main':
        //     case 'stop_main':
        //     case 'download_save':
        //     case 'upload_save':
        //     case 'clear_save':
        //         dispatch({ type: msg_type }); break;
        //     case 'skip_seconds': dispatch({ type: msg_type, amount: parseInt(target.dataset.amount ?? '', 10) }); break;
        //     default: throw new Error(`unknown msg_type: ${msg_type}`);
        // }
    });
}

/**
 * @param {HTMLElement} app 
 */
function add_event_listener_keydown(app) {
    app.addEventListener('keydown', (event) => {
        // const delta = key_to_delta(event.key);

        // if (Opt.is_some(delta)) {
        //     event.preventDefault(); // empêche scroll avec flèches
        //     dispatch({ type: 'movement', delta: delta.value });
        // }
    });
}

// export function clear() {
//     EventBus.clear(EB);
//     Action.clear();
//     set_world(World.create());
//     set_ui_state(UIState.create());
// }

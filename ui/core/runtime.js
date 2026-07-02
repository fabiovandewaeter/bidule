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

export const EB = EventBus.create();
export let [WORLD, UI_STATE] = init();
export let should_save = false;

/**
 * @param {World} new_world 
 */
export function set_world(new_world) { WORLD = { ...WORLD, ...new_world }; }
/**
 * @param {UIState} new_ui_state 
 */
export function set_ui_state(new_ui_state) { UI_STATE = new_ui_state; }
/**
 * @param {boolean} new_should_save 
 */
export function set_should_save(new_should_save) { should_save = new_should_save; }

/**
 * @returns {[World, UIState]}}
 */
function init() {
    const app = /**@type {HTMLElement}*/(document.getElementById('app'));
    app.tabIndex = -1
    app.focus();

    // attache les events listeners au app pour qu'ils ne soient jamais détruit par un innerHTML
    add_event_listener_click(app);
    add_event_listener_keydown(app);

    // let model = Model.create();
    // // déjà initialisé si load depuis save, sinon on initialise ici
    // if (!model.is_initialized) model = Model.init(model);
    // view(null, model);

    let world, ui_state;
    const saved_opt = Save.load();
    if (Opt.is_some(saved_opt)) {
        world = load_world(saved_opt.value);
        console.log(saved_opt.value)
        // ICI ça load pas quand save
        // ui = saved_opt.value.ui;
        ui_state = UIState.create();
    }
    else {
        world = World.create();
        World.init(world);
        ui_state = UIState.create();
    }

    // init_actions();
    Scene.render_current_scene(app, world, ui_state);

    EB.on('scene_switched', () => Scene.render_current_scene(app, world, ui_state));
    window.addEventListener('beforeunload', () => { if (should_save) Save.save(world, ui_state); })
    window.addEventListener('pagehide', () => { if (should_save) Save.save(world, ui_state); })

    return [world, ui_state];
}

/**
 * @param {SaveStruct} save_struct
 * @returns {World}
 */
function load_world(save_struct) {
    const world = save_struct.world;
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

export function clear() {
    EventBus.clear(EB);
    Action.clear();
    set_world(World.create());
    set_ui_state(UIState.create());
}

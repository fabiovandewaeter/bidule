// ui/core/runtime.js
// @ts-check

import * as World from '../../engine/core/world.js'
import * as Save from '../../utils/save.js'
import * as Action from './action.js'
import * as UIState from './ui_state.js'
import * as Opt from '../../utils/option.js'
import * as Clock from '../../engine/core/clock.js'

export let [WORLD, UI_STATE] = init();

/**
 * @param {World} new_world 
 */
export function set_world(new_world) { WORLD = new_world; }
/**
 * @param {UIState} new_ui_state 
 */
export function set_ui_state(new_ui_state) { UI_STATE = new_ui_state; }

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

    let world, ui;
    const saved_opt = Save.load();
    if (Opt.is_some(saved_opt)) {
        world = load_world(saved_opt.value);
        ui = saved_opt.value.ui;
    }
    else {
        world = World.create();
        World.init(world);
        ui = UIState.create();
    }

    // init_actions();

    return [world, ui];
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
        // world = /**@type {World}*/(World.update({ ...world, clock: world.clock }, delta));
    }
    world.clock.last_tick_timestamp = now;
    return world;
}

// function init_actions() {
//     Action.register('tick', () => {
//         const delta_ms = Clock.tick(WORLD.clock);
//         World.update(WORLD, delta_ms);
//         // save_timestamp(clock.timestamp);
//         UIState.add_log(UI_STATE, `tick: ${delta_ms} ms`);
//     });
// }

// /**
//  * @param {Msg} msg
//  */
// export function dispatch(msg) {
//     const prev = model;
//     model = update(model, msg);
//     view(prev, model);
//     Save.save(model);
// }

// /**
//  * @param {HTMLElement} app 
//  */
// function add_event_listener_click(app) {
//     app.addEventListener('click', (event) => {
//         const el = /** @type {HTMLElement | null} */ (event.target);
//         const target = /** @type {HTMLElement | null} */ (el?.closest('[data-msg-type]'));
//         if (!target) return;

//         const msg_type = target.dataset.msgType;
//         switch (msg_type) {
//             case 'start_stop_tick_interval':
//             case 'start_main':
//             case 'stop_main':
//             case 'download_save':
//             case 'upload_save':
//             case 'clear_save':
//                 dispatch({ type: msg_type }); break;
//             case 'skip_seconds': dispatch({ type: msg_type, amount: parseInt(target.dataset.amount ?? '', 10) }); break;
//             default: throw new Error(`unknown msg_type: ${msg_type}`);
//         }
//     });
// }
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

        // // const target = /** @type {HTMLElement | null} */ (el?.closest('[data-msg-type]'));
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

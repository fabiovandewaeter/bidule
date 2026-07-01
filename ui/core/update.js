// ui/core/update.js
// @ts-check

import '../../utils/types.js'
// import { advance_clock_by, tick } from '../../engine/core/clock.js'
import * as World from '../../engine/core/world.js'
import * as Res from '../../utils/result.js'
import * as Save from '../../utils/save.js'
import { EB } from '../../utils/event_bus.js'
import { UI_STATE, WORLD } from './runtime.js'
import * as UIState from './ui_state.js'
import * as Clock from '../../engine/core/clock.js'
import * as Runtime from './runtime.js'

/**
 * @param {Model} model
 * @param {Msg} msg
 * @returns {Model} 
 */
export function update(model, msg) {
    // TODO: si logs deviennent trop gros faut sauvegarder dans fichier externe ou faire buffer circulaire + voir dans render_logs en bas la partie qui enlève les anciens de l'affichage
    switch (msg.type) {
        // case 'tick': return tick_update(model, msg);
        case 'start_stop_tick_interval': return start_stop_tick_interval_update(model, msg);
        case 'skip_seconds': return skip_seconds_update(model, msg);
        case 'start_main': return start_main_update(model, msg);
        case 'stop_main': return stop_main_update(model, msg);
        case 'download_save': return download_save_update(model, msg);
        case 'upload_save': return upload_save_update(model, msg);
        case 'clear_save': return clear_save_update(model, msg);
    }
}

// function tick_update() {
//     const delta_ms = tick(WORLD.clock);
//     World.update(WORLD, delta_ms);
//     // save_timestamp(clock.timestamp);
//     UIState.add_log(UI_STATE, `tick: ${delta_ms} ms`);
// }

// function start_stop_tick_interval_update() {
//     let tick_interval_id = UI_STATE.tick_interval_id;
//     if (tick_interval_id !== null) {
//         clearInterval(tick_interval_id);
//         tick_interval_id = null;
//     }
//     else {
//         tick_interval_id = setInterval(() => {
//             const delta_ms = Clock.tick(WORLD.clock);
//             World.update(WORLD, delta_ms);
//             EB.emit('tick');
//         }, TICK_DELAY_MS);
//     }

//     UI_STATE.tick_interval_id = tick_interval_id;
//     WORLD.clock.last_tick_timestamp = Date.now();
//     UIState.add_log(UI_STATE, 'start_stop_tick_interval');
// }

// function skip_seconds_update(amount) {
//     Clock.advance_clock_by(WORLD.clock, amount);
//     World.update(WORLD, amount);
//     // TODO: faut append dans le render
//     // save_timestamp(clock.timestamp);
//     UIState.add_log(UI_STATE, `skip_seconds: ${amount} ms`);
// }

// function start_main_update() {
//     UI_STATE.scene = 'main';
//     UIState.add_log(UI_STATE, 'start_main');
// }

// function stop_main_update() {
//     UI_STATE.scene = 'menu';
//     UIState.add_log(UI_STATE, 'stop_main');
// }

// function download_save_update() { Save.download(WORLD, UI_STATE); }

// function upload_save_update() {
//     Save.upload().then((loaded => {
//         if (loaded) {
//             Runtime.set_world(loaded);
//             WORLD.clock.last_tick_timestamp = Date.now();
//         }
//     }));
// }

// function clear_save_update() { Save.clear(); }

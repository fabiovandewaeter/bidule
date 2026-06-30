// ui/core/update.js
// @ts-check

import '../../utils/types.js'
import { advance_clock_by, tick } from '../../engine/core/clock.js'
import { dispatch } from './runtime.js'
import * as World from '../../engine/core/world.js'
import * as Res from '../../utils/result.js'
import * as Save from '../../utils/save.js'
import { EB } from '../../utils/event_bus.js'

const TICK_DELAY_MS = 1000;

/**
 * @param {Model} model
 * @param {Msg} msg
 * @returns {Model} 
 */
export function update(model, msg) {
    // TODO: si logs deviennent trop gros faut sauvegarder dans fichier externe ou faire buffer circulaire + voir dans render_logs en bas la partie qui enlève les anciens de l'affichage
    switch (msg.type) {
        case 'tick': return tick_update(model, msg);
        case 'start_stop_tick_interval': return start_stop_tick_interval_update(model, msg);
        case 'skip_seconds': return skip_seconds_update(model, msg);
        case 'start_main': return start_main_update(model, msg);
        case 'stop_main': return stop_main_update(model, msg);
        case 'download_save': return download_save_update(model, msg);
        case 'upload_save': return upload_save_update(model, msg);
        case 'clear_save': return clear_save_update(model, msg);
    }
}

/**
 * @param {Model} model 
 * @param {TickMsg} msg
 * @returns {Model}
 */
function tick_update(model, msg) {
    const [clock, delta_ms] = tick(model.world.clock);
    const world = World.update({ ...model.world, clock }, delta_ms);
    // save_timestamp(clock.timestamp);
    return {
        ...model,
        world,
        logs: [...model.logs, `${msg.type}: ${delta_ms} ms`]
    }
}

/**
 * @param {Model} model 
 * @param {StartStopTickIntervalMsg} msg
 * @returns {Model}
 */
function start_stop_tick_interval_update(model, msg) {
    let tick_interval_id = model.tick_interval_id;
    if (tick_interval_id !== null) {
        clearInterval(tick_interval_id);
        tick_interval_id = null;
    }
    else {
        tick_interval_id = setInterval(() => {
            dispatch({ type: 'tick' });
        }, TICK_DELAY_MS);
    }

    const world_thaw = /**@type {World} */(model.world);
    return {
        ...model,
        tick_interval_id,
        world: { ...world_thaw, clock: { ...model.world.clock, last_tick_timestamp: Date.now() } },
        logs: [...model.logs, `${msg.type}`]
    }
}

/**
 * @param {Model} model 
 * @param {SkipSecondsMsg} msg
 * @returns {Model}
 */
function skip_seconds_update(model, msg) {
    const clock = advance_clock_by(model.world.clock, msg.amount);
    const world = World.update({ ...model.world, clock }, msg.amount);

    // TODO: faut append dans le render
    // save_timestamp(clock.timestamp);
    return {
        ...model,
        world,
        logs: [...model.logs, `${msg.type}: ${msg.amount} ms`]
    }
}

/**
 * @param {Model} model 
 * @param {StartMainMsg} msg
 * @returns {Model}
 */
function start_main_update(model, msg) {
    const model_thaw = /**@type {Model} */(model);
    return {
        ...model_thaw,
        scene: 'main',
        logs: [...model_thaw.logs, `${msg.type}`]
    }
}

/**
 * @param {Model} model 
 * @param {StopMainMsg} msg
 * @returns {Model}
 */
function stop_main_update(model, msg) {
    const model_thaw = /**@type {Model} */(model);
    return {
        ...model_thaw,
        scene: 'menu',
        logs: [...model_thaw.logs, `${msg.type}`]
    }
}

/**
 * @param {Model} model 
 * @param {DownloadSaveMsg} msg
 * @returns {Model}
 */
function download_save_update(model, msg) {
    Save.download(model);
    return model;
}

/**
 * @param {Model} model 
 * @param {UploadSaveMsg} msg
 * @returns {Model}
 */
function upload_save_update(model, msg) {
    let new_model = /**@type {Model}*/(model);
    Save.upload().then((loaded => {
        if (loaded) {
            new_model = loaded;
            new_model.world.clock.last_tick_timestamp = Date.now();
        }
    }));
    return new_model;
}

/**
 * @param {Model} model 
 * @param {ClearSaveMsg} msg
 * @returns {Model}
 */
function clear_save_update(model, msg) {
    Save.clear();
    return model;
}

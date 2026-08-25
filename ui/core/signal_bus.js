// ui/core/signal_bus.js
// @ts-check

import * as SB from '../../utils/signals.js'

/** @typedef {'tick'|'logs'|'scene_switched'|'toggle_tick'|'toggle_logs'} UISignalType*/

// /**
//  * @typedef {Object} UISignalBus
//  * @property {(event: EventName, callback: Function) => () => void} on
//  * @property {(event: EventName, callback: Function) => void} off
//  * @property {(event: EventName, ...args: any[]) => void} emit
//  * @property {Object.<EventName, Function[]>} listeners
//  */

export const BUS = SB.create();

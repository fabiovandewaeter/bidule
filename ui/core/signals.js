// ui/core/signals.js
// @ts-check

import * as SB from '../../utils/signal_bus.js'

/** @typedef {'tick'|'logs'|'scene_switched'|'toggle_tick'|'toggle_logs'} UISignalType*/

export const BUS = SB.create();

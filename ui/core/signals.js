// ui/core/signals.js
// @ts-check

import * as SB from '../../utils/signal_bus.js'

/** 
 * @typedef {'entity_enter_room'|'entity_leave_room'|'room_modified'} RoomUISignalType
 * @typedef {'tick'|'logs'|'scene_switched'|'toggle_tick'|'toggle_logs'|RoomUISignalType} UISignalType
 */

/**@type {import('../../utils/signal_bus.js').SignalBus<UISignalType>} */
export const BUS = SB.create();

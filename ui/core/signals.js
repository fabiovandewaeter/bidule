// ui/core/signals.js
// @ts-check

import * as SB from '../../utils/signal_bus.js'

/** 
 * @typedef {'tick'|'logs'|'scene_switched'|'toggle_tick'|'toggle_logs'} OtherUISignalType
 * @typedef {'entity_enter_room'|'entity_leave_room'|'room_modified'} RoomUISignalType
 * @typedef {'group_modified'|'entity_changed_group'} GroupUISignalType
 * @typedef {'entity_changed'} EntityUISignalType
 * 
 * @typedef {OtherUISignalType|RoomUISignalType|GroupUISignalType|EntityUISignalType} UISignalType
 */

/**@type {import('../../utils/signal_bus.js').SignalBus<UISignalType>} */
export const BUS = SB.create();

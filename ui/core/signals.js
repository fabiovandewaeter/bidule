// ui/core/signals.js
// @ts-check

import * as SBM from "../../utils/signal_bus.js"

/** 
 * @typedef {'tick'|'logs'|'scene_switched'|'toggle_tick'|'toggle_logs'} OtherUISignalType
 * @typedef {'entity_enter_room'|'entity_leave_room'|'room_modified'} RoomUISignalType
 * @typedef {'faction_modified'|'entity_changed_faction'} FactionUISignalType
 * @typedef {'entity_changed'} EntityUISignalType
 * 
 * @typedef {'open_entity_panel'|'close_entity_panel'} MainMenuUISignalType
 * 
 * @typedef {OtherUISignalType|RoomUISignalType|FactionUISignalType|EntityUISignalType|MainMenuUISignalType} UISignalType
 */

/**@type {import("../../utils/signal_bus.js").SignalBus<UISignalType>} */
export const BUS = SBM.create();

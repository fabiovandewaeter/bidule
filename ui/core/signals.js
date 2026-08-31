// ui/core/signals.js
// @ts-check

import * as SBM from "../../utils/signal_bus.js";

/** 
 * @typedef {"tick"|"logs"|"scene_switched"|"toggle_tick"|"toggle_logs"} OtherUISignal
 * @typedef {"entity_enter_room"|"entity_leave_room"|"room_modified"} RoomUISignal
 * @typedef {"faction_modified"|"entity_changed_faction"} FactionUISignal
 * @typedef {"entity_changed"} EntityUISignal
 * 
 * @typedef {"open_entity_panel"|"close_entity_panel"} MainMenuUISignal
 * 
 * @typedef {OtherUISignal|RoomUISignal|FactionUISignal|EntityUISignal|MainMenuUISignal} UISignal
 */

/**@type {import("../../utils/signal_bus.js").SignalBus<UISignal>} */
export const BUS = SBM.create();

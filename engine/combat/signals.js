// engine/combat/signals.js

import * as SBM from "../../utils/signal_bus.js";

- un SBM.create() pour chaque équipe pour les events style "un allie mort" ou "allié prend dégats" pour que les autes agissent en réactions
    - https://claude.ai/chat/4c676d38-bc90-4761-9243-1f1712403e45
- pour sauvegarde voir comment on stock sinon on fait arreter le combat

/** @typedef {} CombatSignal*/

/**@type {import("../../utils/signal_bus.js").SignalBus<CombatSignal>} */
export const BUS = SBM.create();

// TODO
export function init() {
    clear_handlers();
    // Honor.init_signals();
    // ...
}

export function clear_handlers() {

}

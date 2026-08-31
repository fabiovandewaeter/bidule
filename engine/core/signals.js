// engine/core/signals.js
// @ts-check

import * as SBM from "../../utils/signal_bus.js";

// TODO: voir comment faire pour serialiser/save/sauvegarder ceux qu'on enregistre dynamiquement par exemple quand on démarre une quete au milieu de la parte, pour que ça se relance au meme état (stoquer dans une structure l'avancement et autres) et r'ajouter le hook et autres (par exemple parcourir les trucs sauvegardés et avec un dispatch dans truc quete ou autres)

// transmet une informations pour: progression dans une quests (pour guilde des aventuriers ou bosses globaux notamment), honor/factions, passage secret etc.
/** @typedef {'entity_killed'|'entity_moved'} EngineSignal*/

/**@type {import("../../utils/signal_bus.js").SignalBus<EngineSignal>} */
export const BUS = SBM.create();

// TODO
export function init() {
    clear_handlers();
    // Honor.init_signals();
    // ...
}

export function clear_handlers() {

}

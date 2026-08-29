// engine/core/signals.js
//@ts-check

import * as SBM from "../../utils/signal_bus.js"

/** @typedef {'entity_killed'|'entity_moved'} EngineSignalType*/

/**@type {import("../../utils/signal_bus.js").SignalBus<EngineSignalType>} */
export const BUS = SBM.create();

// transmet une informations pour: progression dans une quests (pour guilde des aventuriers ou bosses globaux notamment), honor/factions, passage secret etc.

// TODO
export function init() {
    clear_handlers();
    // Honor.init_signals();
    // ...
}

export function clear_handlers() {

}

// éviter de faire un signal par quete par exemple
// OU ALORS justement ajouter au runtime un listener pour la quete en question car là il faut faire une fonction comme ça pour chaque signal ET faire des boucles pour rien car les conditions de résolution de la quete on peut-être rien à voir

// // systems/quests.js — un seul listener, quel que soit le nombre de quêtes actives
// Signal.register("entity_killed", (world, { victim }) => {
//     for (const quest of world.active_quests) {       // seulement les actives, pas toutes
//         for (const objective of quest.objectives) {
//             if (objective.type === "kill" && matches(objective, victim)) {
//                 objective.progress++;
//                 if (objective.progress >= objective.count) complete_objective(world, quest, objective);
//             }
//         }
//     }
// });

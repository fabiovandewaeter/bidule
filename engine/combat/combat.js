// engine/combat/combat.js
// @ts-check

/**
 * @typedef {import("../entity/team.js").Team} Team
 */
import * as TeamM from "../entity/team.js";

/**
 * @typedef {Object} Combat
 * @property {CombatBus} bus
 * @property {Team} team_a
 * @property {Team} team_b
 * @property {boolean} is_team_a_turn
 */

/**
 * @param {EntityID[]} team_a
 * @param {EntityID[]} team_b
 * @returns {Combat}
 */
export function create(team_a, team_b) {
    return {
        bus: undefined,
        team_a: TeamM.create("team_a", team_a),
        team_b: TeamM.create("team_b", team_b),
        is_team_a_turn: true,
    }
}

/**
 * @param {*} teamA 
 * @param {*} teamB 
 * @returns 
 */
export function start_combat(teamA, teamB) {
    // TODO: voir si avec timeline ou pas

    // const bus = create_combat_bus();
    // S'abonner aux signaux éventuellement (ex: un sort passif global)
    // ...
    // // Boucle de tours...
    // while (!isCombatOver()) {
    //     emit(bus, "TURN_START", { turn: currentTurn });
    //     // actions des entités...
    //     emit(bus, "TURN_END");
    //     currentTurn++;
    // }
    // // Nettoyage (le bus sort du scope et sera garbage-collecté)
    // SBM.clear(bus);
}

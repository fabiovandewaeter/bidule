// engine/core/world.js
//@ts-check

/**
 * @typedef {import('../entity/entity.js').EntityID} EntityID
 * @typedef {import('../entity/entity.js').EntityRepo} EntityRepo
 * @typedef {import('../entity/faction.js').FactionID} FactionID
 * @typedef {import('../entity/faction.js').FactionRepo} FactionRepo
 * @typedef {import('../map/room.js').RoomID} RoomID
 * @typedef {import('../map/tower.js').Tower} Tower
 * @typedef {import('./clock.js').Clock} Clock
 * @typedef {import('./timeline/scheduler.js').TimelineScheduler} TimelineScheduler
 */
import '../../utils/types.js'
import * as ClockM from './clock.js'
import * as TimelineSchedulerM from './timeline/scheduler.js'
import * as TimelineM from './timeline/timeline.js'
import * as TowerM from '../map/tower.js'
import * as EntityM from '../entity/entity.js'
import * as PlayerM from '../entity/player.js'
import * as RepoM from '../../utils/repository.js'
import * as OptM from '../../utils/option.js'
import * as SBM from '../../utils/signal_bus.js'
import * as ESBM from './signals.js'
import * as UISBM from '../../ui/core/signals.js'
import * as RoomM from '../map/room.js'
import * as FactionM from '../entity/faction.js'

/**
 * @typedef {Object} World
 * @property {Clock} clock
 * @property {TimelineScheduler} timeline_scheduler 
 * @property {Tower} tower
 * @property {EntityRepo} entity_repo
 * @property {FactionRepo} faction_repo
 */

/**
 * @returns {World}
 */
export function create() {
    return {
        clock: ClockM.create(null),
        timeline_scheduler: TimelineSchedulerM.create(),
        tower: TowerM.create(),
        entity_repo: RepoM.create(),
        faction_repo: RepoM.create(),
    };
}

/**
 * @param {World} world 
 */
export function init(world) {
    const map = TowerM.init(world.tower);
    // TODO: système pour ajouter les entity directement dans leur room au spawn
    const player = PlayerM.spawn(world.entity_repo, 'The player', TowerM.DEFAULT_ROOM_ID);
    const second_entity = EntityM.spawn(world.entity_repo, 'entity 2', TowerM.DEFAULT_ROOM_ID);

    const faction = FactionM.spawn(world.faction_repo, 'Faction !');
    change_entity_faction(world, player.id, faction.id);

    const default_room = OptM.expect(RepoM.get(world.tower.room_repo, TowerM.DEFAULT_ROOM_ID), 'Room of id DEFAULT_ROOM_ID shoud exist');
    RoomM.add_entity(world.tower.room_repo, default_room.id, player.id);
    RoomM.add_entity(world.tower.room_repo, default_room.id, second_entity.id);
}

/**
 * @param {World} world
 * @param {number} target_time
 */
export function advance_to(world, target_time) {
    TimelineM.advance_to(world, target_time);
    world.clock.sim_time = target_time;
}
/**
 * @param {World} world
 */
export function advance_to_now(world) { advance_to(world, Date.now()); }

/**
 * @param {World} world
 * @param {number} delta_ms
 */
export function advance_by(world, delta_ms) { advance_to(world, world.clock.sim_time + delta_ms); }

/**
 * @param {World} world
 * @returns {number|null} timestamp du prochain event, ou null si rien de planifié
 */
export function next_event_at(world) {
    const next = TimelineSchedulerM.peek(world.timeline_scheduler);
    return next ? next.at : null;
}

/**
 * @param {World} world 
 * @param {EntityID} entity_id 
 * @param {RoomID} target_id 
 */
export function move_entity(world, entity_id, target_id) {
    OptM.expect(RepoM.get(world.entity_repo, entity_id), `entity should exist: ${entity_id}`);
    OptM.expect(RepoM.get(world.tower.room_repo, target_id), `targeted room should exist: ${target_id}`);
    /**
     * TODO: faire en sorte que move_entity vérifie si l'exit choisie existe dans la room de l'entity
     * et si les conditions sont bonnes etc.
     */
    const previous_room_id = EntityM.move(world.entity_repo, entity_id, target_id);
    RoomM.remove_entity(world.tower.room_repo, previous_room_id, entity_id);
    RoomM.add_entity(world.tower.room_repo, target_id, entity_id);

    // TODO: voir si ça spam beaucoup
    SBM.emit(ESBM.BUS, 'entity_moved', entity_id);
    SBM.emit(UISBM.BUS, 'entity_leave_room', previous_room_id);
    SBM.emit(UISBM.BUS, 'entity_enter_room', target_id);
}

/**
 * @param {World} world 
 * @param {EntityID} entity_id 
 * @param {FactionID} faction_id 
 */
export function change_entity_faction(world, entity_id, faction_id) {
    OptM.expect(RepoM.get(world.entity_repo, entity_id), `entity should exist: ${entity_id}`);
    OptM.expect(RepoM.get(world.faction_repo, faction_id), `targeted faction should exist: ${faction_id}`);

    const previous_faction_id_opt = EntityM.change_faction(world.entity_repo, entity_id, faction_id);
    if (OptM.is_some(previous_faction_id_opt)) {
        FactionM.remove_entity(world.faction_repo, previous_faction_id_opt.value, entity_id);
    }
    FactionM.add_entity(world.faction_repo, faction_id, entity_id);

    // TODO: voir si ça spam beaucoup
    SBM.emit(UISBM.BUS, 'entity_changed_faction', faction_id, entity_id);
}

// /**
//  * @param {World} world
//  * @param {number} delta_ms
//  */
// export function update(world, delta_ms) {
// }

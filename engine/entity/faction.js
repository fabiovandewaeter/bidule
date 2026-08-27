// engine/entity/group.js
//@ts-check

/**
 * @typedef {import('./entity.js').EntityID} EntityID
 * @typedef {import('./group.js').Group} Group
 * @typedef {import('../map/room.js').RoomID} RoomID
 */
import '../../utils/types.js'
import * as RepoM from '../../utils/repository.js'
import * as OptM from '../../utils/option.js'
import * as SBM from '../../utils/signal_bus.js'
import * as UISBM from '../../ui/core/signals.js'
import * as GroupM from './group.js'

const MAX_SIZE = 500;

/**
 * @typedef {Object} Faction
 * @property {FactionID} id
 * @property {string} name
 * @property {Group} group
 * 
 * @typedef {number & {__brand:"FactionID"}} FactionID
 * @typedef {import('../../utils/repository.js').Repo<FactionID, Faction>} FactionRepo
 */

/**
 * @param {FactionRepo} repo
 * @param {string} name
 * @param {number} [max_size]
 * @returns {Faction}
 */
export function spawn(repo, name, max_size = MAX_SIZE) {
    return RepoM.spawn_element(repo, {
        name,
        group: GroupM.create(name, max_size),
    });
}

/**
 * passer par méthodes du World à la place
 * @param {FactionRepo} faction_repo 
 * @param {FactionID} faction_id 
 * @param {EntityID} entity_id
 */
export function add_entity(faction_repo, faction_id, entity_id) {
    const faction = OptM.unwrap(RepoM.get(faction_repo, faction_id));
    GroupM.add_entity(faction.group, entity_id);
    SBM.emit(UISBM.BUS, 'faction_modified', faction_id);
}
/**
 * passer par méthodes du World à la place
 * @param {FactionRepo} faction_repo 
 * @param {FactionID} faction_id 
 * @param {EntityID} entity_id
 */
export function remove_entity(faction_repo, faction_id, entity_id) {
    const faction = OptM.unwrap(RepoM.get(faction_repo, faction_id));
    GroupM.remove_entity(faction.group, entity_id);
    SBM.emit(UISBM.BUS, 'faction_modified', faction_id);
}

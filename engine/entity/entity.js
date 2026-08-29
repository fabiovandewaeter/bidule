// engine/entity/entity.js
//@ts-check

/**
 * @typedef {import("./faction.js").FactionID} FactionID
 * @typedef {import("../map/room.js").RoomID} RoomID
 */
import * as UISBM from "../../ui/core/signals.js"
import * as RepoM from "../../utils/repository.js"
import * as OptM from "../../utils/option.js"
import * as SBM from "../../utils/signal_bus.js"

/**
 * @typedef {Object} Entity
 * @property {EntityID} id
 * @property {string} name
 * @property {RoomID} room_id
 * @property {Opt<FactionID>} faction_id
 * 
 * @typedef {number & {__brand:"EntityID"}} EntityID
 * @typedef {import("../../utils/repository.js").Repo<EntityID, Entity>} EntityRepo
 */
// TODO: classe de départ donne boost de début mais on peut tout maxer ça va juste dépendre des combinaisons qu'on fait

/**
 * @param {EntityRepo} repo
 * @param {string} name
 * @param {RoomID} room_id
 * @param {FactionID} [faction_id] 
 * @returns {Entity}
 */
export function spawn(repo, name, room_id, faction_id) {
    return RepoM.spawn_element(repo, {
        name,
        room_id,
        faction_id: faction_id ? OptM.some(faction_id) : OptM.none,
    });
}

/**
 * @param {EntityRepo} repo 
 * @param {EntityID} entity_id 
 * @param {RoomID} target_id
 * @returns {RoomID}
 */
export function move(repo, entity_id, target_id) {
    const entity = OptM.unwrap(RepoM.get(repo, entity_id));
    const previous_room_id = entity.room_id;
    entity.room_id = target_id;
    SBM.emit(UISBM.BUS, "entity_changed", entity_id);
    return previous_room_id;
}

/**
 * @param {EntityRepo} repo 
 * @param {EntityID} entity_id 
 * @param {FactionID} faction_id
 * @returns {Opt<FactionID>}
 */
export function change_faction(repo, entity_id, faction_id) {
    const entity = OptM.unwrap(RepoM.get(repo, entity_id));
    const previous_faction_id = entity.faction_id;
    if (OptM.is_some(previous_faction_id) && previous_faction_id.value === faction_id) throw new Error(`entity already in the faction: ${entity_id} ${faction_id}`);
    entity.faction_id = OptM.some(faction_id);
    SBM.emit(UISBM.BUS, "entity_changed", entity_id);
    return previous_faction_id;
}

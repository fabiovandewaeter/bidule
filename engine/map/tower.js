// engine/tower/tower.js
// @ts-check

import '../../utils/types.js'
import * as Room from './room.js'
import * as Repo from '../../utils/repository.js'

// Tower > Floor> Region > Zone > Area > Room

export const DEFAULT_ROOM_ID = /**@type {RoomID} */ (0);

/**
 * @typedef {Object} Tower
 * @property {RegionID[]} regions
 * @property {FloorRepo} floor_repo
 * @property {RegionRepo} region_repo
 * @property {ZoneRepo} zone_repo
 * @property {AreaRepo} area_repo
 * @property {RoomRepo} room_repo
 */

/**
 * @returns {Tower}
 */
export function create() {
    return {
        regions: [],
        floor_repo: Repo.create(),
        region_repo: Repo.create(),
        zone_repo: Repo.create(),
        area_repo: Repo.create(),
        room_repo: Repo.create(),
    };
}

/**
 * @param {Tower} tower 
 */
export function init(tower) {
    const first_room = Repo.spawn_element(tower.room_repo, {
        type: 'city',
        name: 'DEFAULT',
        exits: {},
        entities: [],
    });
    // TODO: enlever ça faire une système plus propre
    if (first_room.id != DEFAULT_ROOM_ID) throw new Error(`first_room_id different from DEFAULT_ROOM_ID: ${first_room.id} ${DEFAULT_ROOM_ID}`)
    const seconde_room = Repo.spawn_element(tower.room_repo, {
        type: 'forest',
        name: 'seconde_room',
        exits: {},
        entities: [],
    });
    Room.add_exit(tower.room_repo, first_room.id, 'sortie foret', {
        target_id: seconde_room.id
    });
    // let [_, area] = Area.spawn(tower.area_repo, "area_A");
    // const coords = [
    //     { x: 0, y: 0, z: 0 },
    //     { x: 1, y: 0, z: 0 },
    //     { x: 0, y: 1, z: 0 },
    //     { x: 0, y: 0, z: 1 },
    //     { x: -1, y: 0, z: 0 },
    //     { x: 0, y: -1, z: 0 },
    //     { x: 0, y: 0, z: -1 },
    // ];
    // let new_tower = spawn_rooms(tower, area, coords);

    // let [region_repo, region] = Region.spawn(new_tower.region_repo, "region_A");
    // let [continent_repo, continent] = Continent.spawn(new_tower.continent_repo, "continent_A");

    // return {
    //     ...add_continent(new_tower, continent.id),
    //     continent_repo: Repo.replace(continent_repo, Continent.add_region(continent, region.id)),
    //     region_repo: Repo.replace(region_repo, Region.add_area(region, area.id)),
    // }
}

// /**
//  * @param {D<Tower>} tower 
//  * @param {D<Area>} area 
//  * @param {Coord3D[]} coords 
//  * @returns {D<Tower>}
//  */
// export function spawn_rooms(tower, area, coords) {
//     let current_room_repo = tower.room_repo;
//     let current_area = area;

//     for (const coord of coords) {
//         const [new_room_repo, room] = Room.spawn(current_room_repo, coord, "forest");
//         current_area = Area.add_room(current_area, room.coord, room.id);
//         current_room_repo = new_room_repo;
//     }

//     return {
//         ...tower,
//         area_repo: Repo.replace(tower.area_repo, current_area),
//         room_repo: current_room_repo
//     }
// }

// /**
//  * @param {Tower} tower
//  * @param {ContinentID} id
//  */
// export function add_continent(tower, id) { return { ...tower, continents: [...tower.continents, id] }; }

// /**
//  * @param {Tower} tower
//  * @param {ContinentID} id
//  */
// export function remove_continent(tower, id) { return { ...tower, continents: tower.continents.filter(old_id => old_id === id ? id : old_id) }; }

// engine/tower/tower.js
// @ts-check

import '../../utils/types.js'
import * as Room from './room.js'
import * as Area from './area.js'
import * as Region from './region.js'
import * as Zone from './zone.js'
// import * as Address from './address.js'
import * as Repo from '../../utils/repository.js'
import * as Opt from '../../utils/option.js'
import * as Res from '../../utils/result.js'

// Tower > Floor> Region > Zone > Area > Room

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
    // let [tower, continent] = Continent.spawn(tower_tempo, "continent_A");
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

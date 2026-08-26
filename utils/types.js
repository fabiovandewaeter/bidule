// utils/types.js
// @ts-check

// ==========  ui ==========
/** @typedef {import('../ui/core/ui_state.js').UIState} UIState*/
/** @typedef {import('../ui/core/signals.js').UISignalType} UISignalType*/
/** @typedef {import('../ui/core/store.js').GameStore} GameStore*/

/** @typedef {import('../ui/scenes/scene.js').Scene} Scene*/

/** @typedef {import('../ui/components/sub_comp_manager.js').SubCompKey} SubCompKey*/
/** @typedef {import('../ui/components/sub_comp_manager.js').SubCompManager} SubCompManager*/
// --------------

// ========== engine ==========
/** @typedef {import('../engine/core/clock.js').Clock} Clock*/
/** @typedef {import('../engine/core/world.js').World} World*/
/** @typedef {import('../engine/core/signals.js').EngineSignalType} EngineSignalType*/

// -- timeline --
/** @typedef {import('./repository.js').Repo<TimelineEventID, TimelineEvent>} TimelineEventRepo*/

/** @typedef {import('../engine/core/timeline/event.js').TimelineEventID} TimelineEventID*/
/** @typedef {import('../engine/core/timeline/event.js').TimelineEvent} TimelineEvent*/
/** @typedef {import('../engine/core/timeline/event.js').TimelineEventType} TimelineEventType*/

/** @typedef {import('../engine/core/timeline/heap.js').HeapEntry} HeapEntry*/
/** @typedef {import('../engine/core/timeline/dispatcher.js').TimelineEventHandler} TimelineEventHandler*/
/** @typedef {import('../engine/core/timeline/scheduler.js').TimelineScheduler} TimelineScheduler*/
// -----------

// -- map --
// /** @typedef {import('../engine/map/direction.js').Direction} Direction*/
// /** @typedef {import('../engine/map/coord.js').Coord3D} Coord3D*/
// /** @typedef {import('../engine/map/coord.js').Coord2D} Coord2D*/
// /** @typedef {import('../engine/map/address.js').Address} Address*/
/** @typedef {import('../engine/map/tower.js').Tower} Tower*/

/** @typedef {import('../engine/map/floor.js').Floor} Floor*/
/** @typedef {import('../engine/map/floor.js').FloorID} FloorID*/
/** @typedef {import('./repository.js').Repo<FloorID, Floor>} FloorRepo*/

/** @typedef {import('../engine/map/region.js').Region} Region*/
/** @typedef {import('../engine/map/region.js').RegionID} RegionID*/
/** @typedef {import('./repository.js').Repo<RegionID, Region>} RegionRepo*/

/** @typedef {import('../engine/map/zone.js').Zone} Zone*/
/** @typedef {import('../engine/map/zone.js').ZoneID} ZoneID*/
/** @typedef {import('./repository.js').Repo<ZoneID, Zone>} ZoneRepo*/

/** @typedef {import('../engine/map/area.js').Area} Area*/
/** @typedef {import('../engine/map/area.js').AreaID} AreaID*/
/** @typedef {import('./repository.js').Repo<AreaID, Area>} AreaRepo*/

/** @typedef {import('../engine/map/room.js').Room} Room*/
/** @typedef {import('../engine/map/room.js').RoomID} RoomID*/
/** @typedef {import('../engine/map/room.js').RoomType} RoomType*/
/** @typedef {import('./repository.js').Repo<RoomID, Room>} RoomRepo*/
// ----------


// -- entity --
/** @typedef {import('../engine/entity/entity.js').Entity} Entity*/
/** @typedef {import('../engine/entity/entity.js').EntityID} EntityID*/
/** @typedef {import('./repository.js').Repo<EntityID, Entity>} EntityRepo*/

/** @typedef {import('../engine/entity/group.js').Group} Group*/
/** @typedef {import('../engine/entity/group.js').GroupID} GroupID*/
/** @typedef {import('./repository.js').Repo<GroupID, Group>} GroupRepo*/
// ------------

// ========== utils ==========
/** @typedef {import('./save.js').SaveStruct} SaveStruct */

// -- deep readonly --
/**
 * Pareil que Readonly quand on modifie (car obligé de faire un cast inline) mais bloque
 * mieux dans les fonctions qui font que lire
 * @template T
 * @typedef {T extends (...args: any[]) => any
 *   ? T
 *   : T extends Date | RegExp | Error | bigint | string | number | boolean | symbol | null | undefined
 *     ? T
 *     : T extends Map<infer K, infer V>
 *       ? ReadonlyMap<D<K>, D<V>>
 *       : T extends Set<infer U>
 *         ? ReadonlySet<D<U>>
 *         : T extends readonly any[]
 *           ? { readonly [K in keyof T]: D<T[K]> }
 *           : T extends object
 *             ? { readonly [K in keyof T]: D<T[K]> }
 *             : T
 * } D
 */
// -------------------

// -- option --
/**
 * @template T
 * @typedef {{ readonly _tag: "Some", readonly value: T}} Some
 */
/**
 * @typedef {{ readonly _tag: "None"}} None
 */
/**
 * @template T
 * @typedef { Some<T> | None} Opt
 */
// ------------

// -- result --
/**
 * @template T, E
 * @typedef {{ readonly _tag: "Ok", readonly value: T}} Ok
 */
/**
 * @template T, E
 * @typedef {{ readonly _tag: "Err", readonly error: E}} Err
 */
/**
 * @template T, E
 * @typedef {Ok<T, E> | Err<T, E>} Res
 */
// ------------

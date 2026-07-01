// utils/types.js
// @ts-check

// ==========  ui ==========
/** @typedef {import('../ui/core/ui_state.js').UIState} UIState*/

/** @typedef {import('../ui/core/action.js').ActionName} ActionName*/
/** @typedef {import('../ui/core/action.js').ActionHandler} ActionHandler*/
/** @typedef {import('../ui/core/action.js').Action} Action*/

/** @typedef {import('../ui/scenes/scene.js').Scene} Scene*/

// -- messages --
/** @typedef {import('../ui/core/message.js').TickMsg} TickMsg*/
/** @typedef {import('../ui/core/message.js').StartStopTickIntervalMsg} StartStopTickIntervalMsg*/
/** @typedef {import('../ui/core/message.js').SkipSecondsMsg} SkipSecondsMsg*/
/** @typedef {import('../ui/core/message.js').StartMainMsg} StartMainMsg*/
/** @typedef {import('../ui/core/message.js').StopMainMsg} StopMainMsg*/
/** @typedef {import('../ui/core/message.js').DownloadSaveMsg} DownloadSaveMsg*/
/** @typedef {import('../ui/core/message.js').UploadSaveMsg} UploadSaveMsg*/
/** @typedef {import('../ui/core/message.js').ClearSaveMsg} ClearSaveMsg*/
/** @typedef {import('../ui/core/message.js').Msg} Msg*/
// --------------

// ========== engine ==========
/** @typedef {import('../engine/core/clock.js').Clock} Clock*/
/** @typedef {import('../engine/core/world.js').World} World*/

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

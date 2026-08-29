// ui/component/room_comp.js
// @ts-check

/**
 * @typedef {import("./comp.js").DestroyFunction} DestroyFunction
 * @typedef {import("../../engine/map/room.js").RoomID} RoomID
 */
import "../../utils/types.js"
import * as SBM from "../../utils/signal_bus.js"
import * as UISBM from "../core/signals.js"
import * as StoreM from "../core/store.js"
import * as WorldM from "../../engine/core/world.js"
import * as PlayerM from "../../engine/entity/player.js"
import * as RepoM from "../../utils/repository.js"
import * as OptM from "../../utils/option.js"
import * as CompM from "./comp.js"
import * as UtilsM from "../../utils/utils.js"

const ACTIONS = Object.freeze(/**@type {const}*/({
    MOVE_ENTITY: "move_entity",
    SHOW_ENTITY_MENU: "show_entity_menu",
}));
/**@typedef {EnumValue<typeof ACTIONS>} Action*/

/**
 * @returns {string}
 */
export function render() {
    return `
<h1>Room</h1>
id: <span class="room-id"></span>
type: <span class="room-type"></span>
name: <span class="room-name"></span>
<div class="visible-entities"></div>
<div class="connected-rooms"></div>
    `;
}

/**
 * @param {HTMLElement} el
 */
export function update(el) {
    const s = StoreM.get();
    const current_room_id = get_current_room_id();
    const current_room = OptM.unwrap(RepoM.get(s.world.tower.room_repo, current_room_id));

    const id = el.querySelector(".room-id");
    const type = el.querySelector(".room-type");
    const name = el.querySelector(".room-name");

    if (!id || !type || !name) throw new Error();

    id.textContent = current_room.id.toString();
    type.textContent = current_room.type
    name.textContent = current_room.name;

    // exit list
    const exit_list = el.querySelector(".connected-rooms");
    if (!exit_list) return;
    exit_list.innerHTML = Object.entries(current_room.exits).map(([name, exit]) => (
        `<button data-action="${ACTIONS.MOVE_ENTITY}" data-room-id="${exit.target_id}">
            ${name}
        </button>`
    )).join("");

    const entity_list = el.querySelector(".visible-entities");
    if (!entity_list) return;
    let entity_list_string = "";
    for (const entity_id of current_room.entities) {
        const entity = OptM.unwrap(RepoM.get(s.world.entity_repo, entity_id));
        entity_list_string += `<button data-action="${ACTIONS.SHOW_ENTITY_MENU}" data-entity-id="${entity.id}">
            ${entity.name}
        </button>`
    }
    entity_list.innerHTML = entity_list_string;
}

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: DestroyFunction }}
 */
export function mount(container) {
    return CompM.create_comp(container, "room-comp", (el, add_cleanup) => {
        el.innerHTML = render();

        add_cleanup(CompM.delegate_click_with_enum(el, ACTIONS, (action, event, btn) => {
            handle_action(action, btn);
        }));

        const on_entity_enter_room = (/**@type {RoomID}*/room_id) => {
            const current_room_id = get_current_room_id();
            if (room_id == current_room_id) {
                update(el);
            }
        };
        add_cleanup(SBM.on(UISBM.BUS, "entity_enter_room", on_entity_enter_room));
        const on_entity_leave_room = (/**@type {RoomID}*/previous_room_id) => {
            const current_room_id = get_current_room_id();
            if (previous_room_id == current_room_id) {
                update(el);
            }
        };
        add_cleanup(SBM.on(UISBM.BUS, "entity_leave_room", on_entity_leave_room));
        update(el);
    });
}

/**
 * @param {Action} action
 * @param {HTMLElement} btn
 */
function handle_action(action, btn) {
    const s = StoreM.get();
    switch (action) {
        case ACTIONS.MOVE_ENTITY: {
            /**
             * TODO: faire en sorte que move_entity vérifie si l'exit choisie existe dans la room de l'entity
             * et si les conditions sont bonnes etc.
             */
            WorldM.move_entity(s.world, PlayerM.ID, UtilsM.string_to_rtype(btn.dataset.roomId));
            break;
        }
        case ACTIONS.SHOW_ENTITY_MENU: {
            // const entity = Opt.unwrap(Repo.get(s.world.entity_repo, Utils.string_to_rtype(btn.dataset.entityId)));
            // console.log(entity);
            const entity_id = UtilsM.string_to_rtype(btn.dataset.entityId);
            SBM.emit(UISBM.BUS, "open_entity_panel", entity_id);
            break;
        }
        default: throw new Error(action);
    }
}

/**
 * TODO: ajouter système pour voir d'autres rooms sans déplacer le player mais il faut stocker l'information dans l'UI state
 */
function get_current_room_id() {
    const s = StoreM.get();
    const player = PlayerM.get(s.world.entity_repo);
    return player.room_id;
}

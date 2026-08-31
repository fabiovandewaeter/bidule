// ui/component/entity_comp.js
// @ts-check

/**
 * @typedef {import("./comp.js").DestroyFunction} DestroyFunction
 * @typedef {import("../../engine/entity/entity.js").EntityID} EntityID
 */
import "../../utils/types.js"
import * as SBM from "../../utils/signal_bus.js";
import * as UISBM from "../core/signals.js";
import * as StoreM from "../core/store.js";
import * as WorldM from "../../engine/core/world.js";
import * as PlayerM from "../../engine/entity/player.js";
import * as RepoM from "../../utils/repository.js";
import * as OptM from "../../utils/option.js";
import * as CompM from "./comp.js";
import * as UtilsM from "../../utils/utils.js";

const ACTIONS = Object.freeze(/**@type {const}*/({
    CLOSE_PANEL: "close_panel",
    ADD_TO_FACTION: "add_to_faction",
}));
/**@typedef {EnumValue<typeof ACTIONS>} Action*/

/**
 * @returns {string}
 */
export function render() {
    return `
<h1>Entity</h1>
<button data-action="${ACTIONS.CLOSE_PANEL}">Close</button>
<button data-action="${ACTIONS.ADD_TO_FACTION}">Add to faction</button>
<p>id: <span class="entity-id"></span></p>
<p>name: <span class="entity-name"></span></p>
<p>room_id: <span class="entity-room-id"></span></p>
<p>faction_id: <span class="entity-faction-id"></span></p>
    `;
}

/**
 * @param {HTMLElement} el
 * @param {EntityID} entity_id
 */
export function update(el, entity_id) {
    const s = StoreM.get();
    const entity = OptM.unwrap(RepoM.get(s.world.entity_repo, entity_id));

    const span_id = el.querySelector(".entity-id");
    const span_name = el.querySelector(".entity-name");
    const span_room_id = el.querySelector(".entity-room-id");
    // TODO: faire faction/party/guilds et pas faction_id
    const span_faction_id = el.querySelector(".entity-faction-id");

    if (!span_id || !span_name || !span_room_id || !span_faction_id) throw new Error();

    span_id.textContent = entity.id.toString();
    span_name.textContent = entity.name;
    span_room_id.textContent = entity.room_id.toString();
    span_faction_id.textContent = OptM.is_some(entity.faction_id)
        ? entity.faction_id.value.toString()
        : "none";
}

/**
 * @param {HTMLElement} container 
 * @param {EntityID} entity_id
 * @returns {{element: HTMLElement, destroy: DestroyFunction }}
 */
export function mount(container, entity_id) {
    return CompM.create_comp(container, "entity-comp", (el, add_cleanup) => {
        el.innerHTML = render();

        add_cleanup(CompM.delegate_click_with_enum(el, ACTIONS, (action, event, btn) => {
            handle_action(action, btn, entity_id);
        }));

        const on_entity_changed = (/**@type {EntityID}*/changed_entity_id) => {
            if (changed_entity_id == entity_id) {
                update(el, entity_id);
            }
        };
        add_cleanup(SBM.on(UISBM.BUS, "entity_changed", on_entity_changed));
        update(el, entity_id);
    });
}

/**
 * @param {Action} action
 * @param {HTMLElement} btn
 * @param {EntityID} entity_id
 */
function handle_action(action, btn, entity_id) {
    const s = StoreM.get();
    switch (action) {
        case ACTIONS.CLOSE_PANEL: {
            SBM.emit(UISBM.BUS, "close_entity_panel");
            break;
        }
        case ACTIONS.ADD_TO_FACTION: {
            const player = PlayerM.get(s.world.entity_repo);
            if (entity_id === player.id) {
                console.error(`can't add entity to player's faction because the entity is the player`);
                break;
            }
            if (OptM.is_none(player.faction_id)) {
                console.error(`can't add entity to player's faction because player does not have a faction: ${entity_id}`);
                break;
            }
            WorldM.change_entity_faction(s.world, entity_id, player.faction_id.value);
            break;
        }
        default: throw new Error(action);
    }
}

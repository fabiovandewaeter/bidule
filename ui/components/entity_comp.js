// ui/components/entity_comp.js
// @ts-check

import '../../utils/types.js'
import * as SB from '../../utils/signal_bus.js'
import * as UISB from '../core/signals.js'
import * as Store from '../core/store.js'
import * as World from '../../engine/core/world.js'
import * as Player from '../../engine/entity/player.js'
import * as Repo from '../../utils/repository.js'
import * as Opt from '../../utils/option.js'
import * as Comp from './comp.js'
import * as Utils from '../../utils/utils.js'
/**
 * @typedef {import('./comp.js').DestroyFunction} DestroyFunction
 */

const ACTIONS = Object.freeze({
    CLOSE_PANEL: 'close_panel',
    ADD_TO_FACTION: 'add_to_faction',
});
/**@typedef {EnumValue<typeof ACTIONS>} Action*/

/**
 * @returns {string}
 */
export function render() {
    return `
    <div class="entity-comp">
        <h1>Entity</h1>
        <button data-action="${ACTIONS.CLOSE_PANEL}">Close</button>
        <button data-action="${ACTIONS.ADD_TO_FACTION}">Add to faction</button>
        <p>id: <span class="entity-id"></span></p>
        <p>name: <span class="entity-name"></span></p>
        <p>room_id: <span class="entity-room-id"></span></p>
        <p>group_id: <span class="entity-group-id"></span></p>
    </div>
    `;
}

/**
 * @param {HTMLElement} el
 * @param {EntityID} entity_id
 */
export function update(el, entity_id) {
    const s = Store.get();
    const entity = Opt.unwrap(Repo.get(s.world.entity_repo, entity_id));

    const span_id = el.querySelector('.entity-id');
    const span_name = el.querySelector('.entity-name');
    const span_room_id = el.querySelector('.entity-room-id');
    // TODO: faire faction/party/guilds et pas group_id
    const span_group_id = el.querySelector('.entity-group-id');

    if (!span_id || !span_name || !span_room_id || !span_group_id) throw new Error();

    span_id.textContent = entity.id.toString();
    span_name.textContent = entity.name;
    span_room_id.textContent = entity.room_id.toString();
    span_group_id.textContent = Opt.is_some(entity.group_id)
        ? entity.group_id.value.toString()
        : 'none';
}

/**
 * @param {HTMLElement} container 
 * @param {EntityID} entity_id
 * @returns {{element: HTMLElement, destroy: DestroyFunction }}
 */
export function mount(container, entity_id) {
    return Comp.create_comp(container, (el, add_cleanup) => {
        el.innerHTML = render();

        add_cleanup(Comp.delegate_click_with_enum(el, ACTIONS, (action, event, btn) => {
            handle_action(action, btn);
        }));

        const on_entity_changed = (/**@type {EntityID}*/changed_entity_id) => {
            if (changed_entity_id == entity_id) {
                update(el, entity_id);
            }
        };
        add_cleanup(SB.on(UISB.BUS, 'entity_changed', on_entity_changed));
        update(el, entity_id);
    });
}

/**
 * @param {Action} action
 * @param {HTMLElement} btn
 */
function handle_action(action, btn) {
    const s = Store.get();
    switch (action) {
        case ACTIONS.CLOSE_PANEL: {
            SB.emit(UISB.BUS, 'close_entity_panel');
            break;
        }
        case ACTIONS.ADD_TO_FACTION: {
            // TODO: voir comment récupérer id
            break;
        }
        default: throw new Error(action);
    }
}

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
 * @returns {string}
 */
export function render() {
    return `
    <div class="entity-comp">
        <h1>Entity</h1>
        id: <span class="entity-id"></span>
        name: <span class="entity-room-name"></span>
        room_id: <span class="entity-room-id"></span>
        group_id: <span class="entity-group-id"></span>
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

    const span_name = el.querySelector('.entity-name');
    const span_room_id = el.querySelector('.entity-room-id');
    // TODO: faire faction/party/guilds et pas group_id
    const span_group_id = el.querySelector('.entity-group-id');

    if (!span_name || !span_room_id || !span_group_id) throw new Error();

    span_name.textContent = entity.name;
    span_room_id.textContent = entity.room_id.toString();
    // TODO: pas sur car c'est Opt<GroupID>
    span_group_id.textContent = entity.group_id.toString();
}

/**
 * @param {HTMLElement} container 
 * @param {EntityID} entity_id
 * @returns {{element: HTMLElement, destroy: () => void }}
 */
export function mount(container, entity_id) {
    return Comp.create_comp(container, (el, add_cleanup) => {
        el.innerHTML = render();

        // add_cleanup(Comp.delegate_click(el, (action, event, btn) => {
        //     handle_action(action, btn);
        // }));

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
 * @param {string} action
 * @param {HTMLElement} btn
 */
function handle_action(action, btn) {
    const s = Store.get();
    switch (action) {
        case 'add_to_faction': {
            break;
        }
        default: throw new Error(action);
    }
}

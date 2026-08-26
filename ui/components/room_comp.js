// ui/components/room_comp.js
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
    <div class="room-comp">
        <h1>Room</h1>
        id: <span class="room-id"></span>
        type: <span class="room-type"></span>
        name: <span class="room-name"></span>
        <div class="visible-entities"></div>
        <div class="connected-rooms"></div>
    </div>
    `;
}

/**
 * TODO: ajouter système pour voir d'autres rooms sans déplacer le player mais il faut stocker l'information dans l'UI state
 */
function get_current_room_id() {
    const s = Store.get();
    const player = Player.get(s.world.entity_repo);
    return player.room_id;
}

/**
 * @param {HTMLElement} el
 */
export function update(el) {
    const s = Store.get();
    const current_room_id = get_current_room_id();
    const current_room = Opt.unwrap(Repo.get(s.world.tower.room_repo, current_room_id));

    const id = el.querySelector('.room-id');
    const type = el.querySelector('.room-type');
    const name = el.querySelector('.room-name');

    if (!id || !type || !name) throw new Error();

    id.textContent = current_room.id.toString();
    type.textContent = current_room.type
    name.textContent = current_room.name;

    // exit list
    const exit_list = el.querySelector('.connected-rooms');
    if (!exit_list) return;
    exit_list.innerHTML = Object.entries(current_room.exits).map(([name, exit]) => (
        `<button data-action="move_entity" data-room-id="${exit.target_id}">
            ${name}
        </button>`
    )).join('');

    const entity_list = el.querySelector('.visible-entities');
    if (!entity_list) return;
    let entity_list_string = '';
    for (const entity_id of current_room.entities) {
        const entity = Opt.unwrap(Repo.get(s.world.entity_repo, entity_id));
        entity_list_string += `<button data-action="show_entity_menu" data-entity-id="${entity.id}">
            ${entity.name}
        </button>`
    }
    entity_list.innerHTML = entity_list_string;
}

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: () => void }}
 */
export function mount(container) {
    return Comp.create_comp(container, (el, add_cleanup) => {
        el.innerHTML = render();

        add_cleanup(Comp.delegate_click(el, (action, event, btn) => {
            handle_action(action, btn);
        }));

        // add_cleanup(SB.on(UISB.BUS, 'room_changed', () => update(el)));
        // faire plus fin que ça faut faut event entrer et quitter room je pense
        // add_cleanup(SB.on(ESB.BUS, 'entity_moved', () => update(el)));
        const on_entity_enter_room = (/**@type {RoomID}*/room_id) => {
            const current_room_id = get_current_room_id();
            if (room_id == current_room_id) {
                update(el);
            }
        };
        add_cleanup(SB.on(UISB.BUS, 'entity_enter_room', on_entity_enter_room));
        const on_entity_leave_room = (/**@type {RoomID}*/previous_room_id) => {
            const current_room_id = get_current_room_id();
            if (previous_room_id == current_room_id) {
                update(el);
            }
        };
        add_cleanup(SB.on(UISB.BUS, 'entity_leave_room', on_entity_leave_room));
        update(el);
    });
}

/**
 * @param {string} action
 * @param {HTMLElement} btn
 */
function handle_action(action, btn) {
    const s = Store.get();
    switch (action) {
        case 'move_entity': {
            /**
             * TODO: faire en sorte que move_entity vérifie si l'exit choisie existe dans la room de l'entity
             * et si les conditions sont bonnes etc.
             */
            World.move_entity(s.world, Player.ID, Utils.string_to_rtype(btn.dataset.roomId));
            break;
        }
        case 'show_entity_menu': {
            const entity = Opt.unwrap(Repo.get(s.world.entity_repo, Utils.string_to_rtype(btn.dataset.entityId)));
            console.log(entity);
            break;
        }
        default: throw new Error(action);
    }
}

// ui/component/logs_comp.js
// @ts-check

/**
 * @typedef {import("./comp.js").DestroyFunction} DestroyFunction
 */
import "../../utils/types.js"
import * as SBM from "../../utils/signal_bus.js"
import * as UISBM from "../core/signals.js"
import * as StoreM from "../core/store.js"
import * as CompM from "./comp.js"

const MAX_RENDERED_LOGS = 10;

/**
 * @returns {string}
 */
export function render() {
    return `
<h1>Logs</h1>
<ul class="logs-list"></ul>
    `;
}

/**
 * @param {HTMLElement} container 
 * @returns {{element: HTMLElement, destroy: DestroyFunction }}
 */
export function mount(container) {
    return CompM.create_comp(container, "logs-comp", (el, add_cleanup) => {
        el.innerHTML = render();

        const update = () => {
            const s = StoreM.get();
            const list = el.querySelector(".logs-list");
            if (!list) return;
            list.innerHTML = s.ui_state.logs
                .slice(-MAX_RENDERED_LOGS)
                .map(log => `<li>${log}</li>`)
                .join("");
        };

        add_cleanup(SBM.on(UISBM.BUS, "logs", update));
        // TODO: NE PAS METTRE CAR les components ne doivent pas se toggle eux meme ça se fait dans menu_comp.js
        // const off_toggle = SB.on(UISB.BUS, "toggle_logs", () => {
        //     el.classList.toggle("hidden");
        // });
        update();
    });
}

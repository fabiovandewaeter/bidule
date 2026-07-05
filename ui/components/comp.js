// ui/components/comp.js
// @ts-check

// TODO: ça marche pas ça si y'a différents types de children ou si on veut choisir
/**
 * Crée un gestionnaire de composants enfants.
 * @returns {{ add: (child: { destroy: () => void }) => void, remove_last: () => void, destroy_all: () => void }}
 */
export function create_child_manager() {
    /** @type {{ destroy: () => void }[]} */
    const children = [];

    return {
        add(child) { children.push(child); },
        remove_last() {
            const child = children.pop();
            child?.destroy();
        },
        destroy_all() {
            for (let i = children.length - 1; i >= 0; i--) {
                children[i].destroy();
            }
            children.length = 0;
        }
    };
}

/**
 * Crée un composant avec un cycle de vie standard.
 * @param {HTMLElement} container
 * @param {(root: HTMLElement) => () => void} setup - retourne une fonction de nettoyage
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function create_comp(container, setup) {
    const root = document.createElement('div');
    const internal_destroy = setup(root);
    const destroy = () => {
        internal_destroy();
        root.remove();
    };
    container.appendChild(root);
    return { element: root, destroy };
}

/**
 * Attache un écouteur de clic par délégation sur l'élément racine.
 * @param {HTMLElement} root
 * @param {Object.<string, (event: Event, target: HTMLElement) => void>} action_map
 * @returns {() => void} fonction de désabonnement
 */
export function delegate_click(root, action_map) {
    /** @type {(event: Event) => void} */
    const handler = (event) => {
        if (!(event.target instanceof HTMLElement)) throw new Error();
        const target = event.target?.closest('[data-action]');
        if (!target || !(target instanceof HTMLElement)) return;
        const action = target.dataset.action;
        if (action && action_map[action]) {
            action_map[action](event, target);
        }
    };
    root.addEventListener('click', handler);
    return () => root.removeEventListener('click', handler);
}

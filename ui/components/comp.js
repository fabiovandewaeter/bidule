// ui/components/comp.js
// @ts-check

import * as CCM from './child_comp_manager.js'

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
 * Comme create_comp, mais fournit un child_comp_manager et garantit sa destruction
 * automatiquement après le cleanup — impossible d'oublier destroy_all.
 * @param {HTMLElement} container
 * @param {(root: HTMLElement, children: CCM.ChildCompManager) => (() => void) | void} setup
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function create_comp_with_children(container, setup) {
    return create_comp(container, (root) => {
        const children = CCM.create();
        const internal_destroy = setup(root, children);
        return () => {
            internal_destroy?.();
            CCM.destroy_all(children);
        };
    });
}

/**
 * Attache un écouteur de clic par délégation sur l'élément racine.
 * @param {HTMLElement} root
 * @param {Record<string, (event: Event, target: HTMLElement) => void>} action_map
 * @returns {() => void} fonction de désabonnement
 */
export function delegate_click(root, action_map) {
    /** @type {(event: Event) => void} */
    const handler = (event) => {
        const target = (event.target instanceof Element)
            ? event.target.closest('[data-action]')
            : null;
        if (!target) return; // clic hors bouton → on ignore

        const action = target.getAttribute('data-action');
        if (action && action_map[action]) {
            action_map[action](event, /** @type {HTMLElement} */(target));
        }
    };
    root.addEventListener('click', handler);
    return () => root.removeEventListener('click', handler);
}

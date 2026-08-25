// ui/components/comp.js
// @ts-check

import * as SCM from './sub_comp_manager.js'

/**
 * Crée un composant avec un cycle de vie standard.
 * @param {HTMLElement} container
 * @param {(root: HTMLElement, add_cleanup: (fn: () => void) => void) => void | (() => void)} setup
 *        - `add_cleanup` : enregistre une fonction de nettoyage (sera appelée au destroy).
 *        - le retour éventuel de `setup` est aussi utilisé comme nettoyage.
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function create_comp(container, setup) {
    const root = document.createElement('div');
    /**@type {Function[]} */
    const cleanups = [];

    // ajoute les fonctions off des SignalBus.on() à la fonction destroy pour ne pas oublier
    const add_cleanup = (/** @type {Function} */ fn) => cleanups.push(fn);
    const internal_destroy = setup(root, add_cleanup);

    const destroy = () => {
        // internal_destroy();
        // d'abord les nettoyages explicites (retour du setup)
        if (typeof internal_destroy === 'function') {
            internal_destroy();
        }
        // puis tous les nettoyages enregistrés (dans l'ordre inverse d'ajout, par sécurité)
        for (let i = cleanups.length - 1; i >= 0; i--) {
            cleanups[i]();
        }
        root.remove();
    };

    container.appendChild(root);
    return { element: root, destroy };
}

/**
 * Version qui gère en plus un SubCompManager.
 * @param {HTMLElement} container
 * @param {(root: HTMLElement, sub_comps: SCM.SubCompManager, addCleanup: (fn: () => void) => void) => void | (() => void)} setup
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function create_comp_with_sub_comps(container, setup) {
    return create_comp(container, (root, add_cleanup) => {
        const sub_comps = SCM.create();
        // const internal_destroy = setup(root, sub_comps);
        // return () => {
        //     internal_destroy?.();
        //     SCM.destroy_all(sub_comps);
        // };
        // On enregistre la destruction des sous-composants comme nettoyage automatique.
        add_cleanup(() => SCM.destroy_all(sub_comps));
        // On appelle le setup de l'utilisateur avec le manager et addCleanup.
        return setup(root, sub_comps, add_cleanup);
    });
}

//  TODO: voir pour prendre un switch au lieu d'une map ??? sinon faut recopier à la main les clés c'est nul
/**
 * Attache un écouteur de clic par délégation sur l'élément racine.
 * @param {HTMLElement} root
 * @param {(action: string, event: Event, target: HTMLElement) => void} handler
 * @returns {() => void} fonction de désabonnement
 */
export function delegate_click(root, handler) {
    /** @type {(event: Event) => void} */
    const on_click = (event) => {
        const target = (event.target instanceof Element)
            ? event.target.closest('[data-action]')
            : null;
        if (!target) return; // clic hors bouton → on ignore

        const action = target.getAttribute('data-action');
        // if (action && action_map[action]) {
        //     action_map[action](event, /** @type {HTMLElement} */(target));
        // }
        if (action) {
            handler(action, event, /** @type {HTMLElement} */(target));
        }
    };
    root.addEventListener('click', on_click);
    return () => root.removeEventListener('click', on_click);
}

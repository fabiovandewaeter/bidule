// engine/combat/spell.js
// @ts-check


FAIRE UN REPOSITORY DE SPELLS DU COUP

    - crafter les spells in game et pas déjà tout fait(voir sorts qui consomment autre que mana, des pourcentages de pv max et tout peut être avec un type pour cost)
        - pour les spells j'ai envie de faire en sorte qu'on les craft in game, est - ce que ça change quelque chose ? Je ne sais pas si j'aurais une liste de base ou pas mais je pense que ce qui change c'est la possibilité d'ajouter des spells au runtime, mais du coup on ne peut pas avoir de dispatch fix (je ne sais pas si c'est ce que tu as fais je n'ai pas encore tout lu). Pareil pour les status peut-être que je voudrais les rendre craftables ou pas, peut-être plutot voir les status comme des trucs atomiques que j'utilise en plus dans mes spells craftés in game en plus des effets atomiques

/**
 * @typedef {Object} SpellContext
 * @property {EntityID} caster
 * @property {EntityID[]} targets
 */

/**
 * @typedef {Object} SpellDefinition
 * @property {string} name
 * @property {number} cost
 * @property {(ctx: SpellContext) => AtomicEffect[]} resolve
 */

/** @satisfies {Record<string, SpellDefinition>} */
export const SPELLS = Object.freeze({
    FIREBALL: {
        name: "Boule de feu",
        cost: 4,
        resolve: (ctx) => ctx.targets.map(t => (
      /** @type {DamageEffect} */({ type: "DAMAGE", amount: 20, tags: ["FIRE"] })
        )),
    },
    BLEED_TICK: {
        name: "Saignement",
        cost: 0,
        resolve: (ctx) => ctx.targets.map(t => (
      /** @type {DamageEffect} */({ type: "DAMAGE", amount: 3, tags: ["BLEEDING"] })
        )),
    },
    POISON_DAGGER: {
        name: "Dague empoisonnée",
        cost: 2,
        resolve: (ctx) => ctx.targets.map(t => (
      /** @type {ApplyStatusEffect} */({ type: "APPLY_STATUS", status: { type: "POISON", stacks: 1, duration: 5 } })
        )),
    },
});

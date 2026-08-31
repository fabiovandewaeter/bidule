// engine/combat/status.js
// @ts-check

/** @typedef {Object} BleedingStatus @property {"BLEEDING"} type @property {number} stacks @property {number} duration */
/** @typedef {Object} StunStatus @property {"STUN"} type @property {number} turns_left */
/** @typedef {Object} PoisonStatus @property {"POISON"} type @property {number} stacks @property {number} duration */
/** @typedef {BleedingStatus | StunStatus | PoisonStatus} Status */

/**
 * @template {Status} T
 * @typedef {Object} StatusHooks
 * @property {(existing: T, incoming: T) => T} [onStack]
 * @property {(ctx: SpellContext, status: T) => AtomicEffect[]} [onTurnStart]
 * @property {(ctx: SpellContext, status: T) => AtomicEffect[]} [onTurnEnd]
 * @property {(ctx: {self: EntityID}, status: T) => boolean} [canAct]     // false = bloque l'action (stun)
 * @property {(ctx: HitContext, status: T, incoming_damage: number) => number} [onHitTaken] // modifie les dégâts subis
 * @property {(status: T) => boolean} [isExpired]
 */

/** @typedef {{[K in Status["type"]]: StatusHooks<Extract<Status, {type: K}>>}} StatusRegistry */

/** @type {StatusRegistry} */
export const STATUS_DEFS = {
    BLEEDING: {
        onStack: (e, i) => ({ type: "BLEEDING", stacks: e.stacks + i.stacks, duration: Math.max(e.duration, i.duration) }),
        onTurnStart: (ctx, status) => SPELLS.BLEED_TICK.resolve({ caster: ctx.self, targets: [ctx.self] }),
        isExpired: (status) => status.duration <= 0,
    },
    STUN: {
        canAct: () => false,
        isExpired: (status) => status.turns_left <= 0,
    },
    POISON: {
        onTurnStart: (ctx, status) => [
      /** @type {DamageEffect} */({ type: "DAMAGE", amount: status.stacks * 2, tags: ["POISON"] })
        ],
        isExpired: (status) => status.duration <= 0,
    },
};

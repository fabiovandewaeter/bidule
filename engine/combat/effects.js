// engine/combat/effects.js
// @ts-check

/**
 * @typedef {import("./status.js").Status} Status
 * @typedef {import("./tag/tag.js").TagKey} TagKey
 * @typedef {import("./stat.js").Stat} StatKey
 */

https://chat.deepseek.com/a/chat/s/05a415d8-90ed-446c-a572-af0da67e0faf
-> passage à Object.freeze()

// effets atomics que les autres vont utiliser
/**
 * @typedef {Object} DamageEffect
 * @property {"DAMAGE"} type
 * @property {number} amount
 * @property {TagKey[]} tags        // pour la matrice d'efficacité + hooks onHitTaken
 * 
 * @typedef {Object} HealEffect
 * @property {"HEAL"} type
 * @property {number} amount
 * 
 * @typedef {Object} ApplyStatusEffect
 * @property {"APPLY_STATUS"} type
 * @property {Status} status
 * 
 * @typedef {Object} StatModificationEffect
 * @property {"STAT_MODIFICATION"} type
 * @property {StatKey} stat
 * @property {number} value
 * @property {number} duration
 * 
 * @typedef {DamageEffect | HealEffect | ApplyStatusEffect | StatModificationEffect} AtomicEffect
 */

/**
 * @typedef {Object} BleedingEffect
 * @property {"bleeding"} type
 * @property {number} duration
 */

/**
 * @typedef {Object} SlashingEffect
 * @property {"slashing"} type
 */

/** @typedef {BleedingEffect | SlashingEffect} Effect */

/**
 * @param {number} duration
 * @returns {BleedingEffect}
 */
export function Bleeding(duration) {
    return { type: "bleeding", duration };
}

/** @returns {SlashingEffect} */
export function Slashing() {
    return { type: "slashing" };
}

/**
 * @param {AtomicEffect[]} effects
 * @param {{source: EntityID, target: EntityID, bus: CombatBus}} ctx
 */
export function resolve_effects(effects, ctx) {
    for (const effect of effects) {
        switch (effect.type) {
            case "DAMAGE": {
                const mult = effect.tags.reduce((m, tag) => m * getEffectivenessAgainst(tag, ctx.target), 1);
                let final_damage = effect.amount * mult;
                // hooks défensifs (Reflecting/Dense/Deviating) peuvent modifier/rediriger ici
                for (const status of ctx.target.statuses) {
                    final_damage = getStatusDef(status.type).onHitTaken?.(ctx, status, final_damage) ?? final_damage;
                }
                applyDamage(ctx.target, final_damage);
                emit(ctx.bus, "hit_dealt", { attacker: ctx.source, defender: ctx.target, damage: final_damage });
                break;
            }
            case "HEAL":
                applyHeal(ctx.target, effect.amount);
                break;
            case "APPLY_STATUS":
                applyStatus(ctx.target, effect.status, ctx.bus);
                break;
            case "CLEAR_STATUS":
                // TODO
                break;
            case "STAT_MODIFICATION":
                applyStatMod(ctx.target, effect);
                break;
        }
    }
}

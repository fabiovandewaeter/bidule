// engine/core/timeline/types.js
//@ts-check

// craft_complete, building_complete, potion_effect ...

/**
 * @typedef {Object} TimelineEvent
 * @property {TimelineEventID} id
 * @property {TimelineEventType} type
 * @property {number} at
 * @property {Object} payload
 * 
 * @typedef {'craft_complete'|'building_complete'|'potion_effect'} TimelineEventType
 * @typedef {number & {__brand:"TimelineEventID"}} TimelineEventID
 * @typedef {import('../../../utils/repository.js').Repo<TimelineEventID, TimelineEvent>} TimelineEventRepo
 */

export { };

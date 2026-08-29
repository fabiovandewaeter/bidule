// engine/item/tag.js
//@ts-check

const ACTIONS = Object.freeze({
    SKIP_SECONDS: "skip_seconds",
    TOGGLE_TICK: "toggle_tick",
    SWITCH_SCENE: "switch_scene",
    DOWNLOAD_SAVE: "download_save",
    UPLOAD_SAVE: "upload_save",
    CLEAR_SAVE: "clear_save",
});
/**@typedef {EnumValue<typeof ACTIONS>} Action*/
/**@typedef {A<typeof ACTIONS>} AB*/

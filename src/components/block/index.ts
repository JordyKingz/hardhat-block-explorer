import type { App, Plugin } from "vue";

import Block from "./Block.vue";

export default {
    install(Vue: App) {
        Vue.component(Block.__name || "Block", Block);
    },
} as Plugin;

export { Block };
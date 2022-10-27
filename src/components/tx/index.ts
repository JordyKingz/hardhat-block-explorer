import type { App, Plugin } from "vue";

import Tx from "./Hash.vue";

export default {
    install(Vue: App) {
        Vue.component(Tx.__name || "Tx", Tx);
    },
} as Plugin;

export { Tx };
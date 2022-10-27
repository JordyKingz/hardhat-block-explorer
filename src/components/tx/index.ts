import type { App, Plugin } from "vue";

import Tx from "./Tx.vue";

export default {
    install(Vue: App) {
        Vue.component(Tx.__name || "Tx", Tx);
    },
} as Plugin;

export { Tx };
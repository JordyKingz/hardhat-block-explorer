import type { App, Plugin } from "vue";

import Address from "./Address.vue";

export default {
    install(Vue: App) {
        Vue.component(Address.__name || "Address", Address);
    },
} as Plugin;

export { Address };
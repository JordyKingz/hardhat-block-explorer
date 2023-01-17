import type { App, Plugin } from "vue";

import Search from "./Search.vue";

export default {
    install(Vue: App) {
        Vue.component(Search.__name || "Search", Search);
    },
} as Plugin;

export { Search };
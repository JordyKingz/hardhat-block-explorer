import type { App, Plugin } from "vue";

import Home from "./Home.vue";

export default {
    install(Vue: App) {
        Vue.component(Home.__name || "Home", Home);
    },
} as Plugin;

export { Home };
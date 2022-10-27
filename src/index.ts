import { createWebHistory } from "vue-router";
import type { App, Plugin } from "vue";

import * as _components from "./components";
import { useRouter, useRoute, createRouter } from "vue-router";

import _home from "./components/home";
import _block from "./components/block";
import _address from "./components/address";
import _tx from "./components/tx";

import "./assets/main.css";

export function create(): Plugin {
    return {
        install(app: App) {
            // Auto import all components
            for (const componentKey in _components) {
                app.use((_components as any)[componentKey]);
            }
        },
    };
}

export const components = _components;

// export each component
export const Home = _home;
export const Block = _block;
export const Address = _address;
export const Tx = _tx;

const Explorer = {
    create: create,
    components: components,
};

export default Explorer;

// export all components as vue plugin
export * from "./components";
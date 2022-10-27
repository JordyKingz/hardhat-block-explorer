import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)
// @ts-ignore
app.use(router)

app.mount('#explorer')

export default app;

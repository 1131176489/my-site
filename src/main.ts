import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import App from './App.vue'
import axios from "axios";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import rem from './plugins/rem'
import reSizeContainer from './plugins/reSizeContainer'
const pinia = createPinia()
const app = createApp(App)
app.use(rem)
app.use(pinia)
app.use(reSizeContainer)
app.provide('reSizeContainer',reSizeContainer)
app.config.globalProperties.$rem()
axios.defaults.baseURL = "http://192.168.0.106:9000"
axios.defaults.timeout = 6000

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')  

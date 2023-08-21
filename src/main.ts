import { createApp } from "vue"
import { createPinia } from "pinia"
import "./assets/main.css"
import router from "./assets/route"
import App from "./App.vue"
import axios from "axios"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import 'element-plus/theme-chalk/display.css'


import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn'
const pinia = createPinia()
const app = createApp(App)
app.use(ElementPlus, {
        locale: zhCn,
})
app.use(router)
app.use(pinia)
console.log(import.meta)
if (import.meta.env.MODE == 'development') {
        axios.defaults.baseURL = "http://192.168.0.106:9000"
}
else {
        axios.defaults.baseURL = "/"
}
//单位为秒
axios.defaults.timeout = 60000
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
}
router.beforeEach(async (to, from) => {
        let isAuthenticated = localStorage.getItem("token")
        if (!isAuthenticated) {
                if (to.name !== "Login") {
                        return { name: "Login" }
                }
        }
        else {
                axios.get("video/getInfo", {
                        headers: {
                                'Authorization': "Bearer " + localStorage.getItem("token"),
                        },
                }).then(() => {
                }).catch(() => {
                        localStorage.removeItem("token")
                        router.push({
                                name: "Login"
                        })
                })
                axios.defaults.headers.Authorization = "Bearer " + isAuthenticated
        }
})
app.mount("#app")  

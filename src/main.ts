import { createApp } from "vue"
import { createPinia } from "pinia"
import "./assets/main.css"
import router from "./assets/route"
import App from "./App.vue"
import axios from "axios"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import rem from "./plugins/rem"
import reSizeContainer from "./plugins/reSizeContainer"
import { ElMessage } from "element-plus"

const pinia = createPinia()
const app = createApp(App)
app.use(rem)
app.use(pinia)
app.use(reSizeContainer)
app.provide("reSizeContainer", reSizeContainer)
app.config.globalProperties.$rem()
axios.defaults.baseURL = "http://192.168.0.106:9000"
axios.defaults.timeout = 6000
axios.interceptors.response

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)


router.beforeEach(async (to, from) => {
        let isAuthenticated = localStorage.getItem("token")
        if (!isAuthenticated) {
                if (
                        to.name !== "Login" &&
                        to.name !== "step1"&&
                        to.name !== "step2"&&
                        to.name !== "step3")
                {
                                return { name: "Login" }
                }
        }
        else {
                axios.post("./test", null, {
                        headers: {
                                'Authorization': "Bearer " + localStorage.getItem("token"),
                        },
                }).then(() => {
                        router.push({
                                name: "Home"
                        })
                }).catch(() => {
                        ElMessage({
                                type: "warning",
                                message: "登陆失效，请重新登录"
                        })
                        localStorage.removeItem("token")
                        router.push({
                                name: "Login"
                        })
                })
                axios.defaults.headers.Authorization = "Bearer " + isAuthenticated
                // axios.defaults.headers.Authorization = null
        }
    })
app.mount("#app")  

import {createApp} from "vue"
import {createPinia} from "pinia"
import "./assets/main.css"
import router from "./assets/route"
import App from "./App.vue"
import axios from "axios"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import 'element-plus/theme-chalk/display.css'


import ElementPlus from 'element-plus'
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.js'

const pinia = createPinia()
const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(router)
app.use(pinia)
// if (import.meta.env.MODE == 'development') {
//         axios.defaults.baseURL = "http://localhost"
// }
// else {
//         axios.defaults.baseURL = "/"
// }
//单位为秒

axios.defaults.timeout = 60000
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
axios.interceptors.request.use((config) => {
        // 在发送请求之前做些什么
        console.log('请求拦截器 - 请求配置:', config);

        // 添加认证 Token
        const token = localStorage.getItem('token');
        if (token) {
            //@ts-ignore
            config.headers!.token = token;
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        console.error('请求拦截器 - 请求错误:', error);
        return Promise.reject(error);
    })
// router.beforeEach(async (to, from) => {
//         let isAuthenticated = localStorage.getItem("token")
//         if (!isAuthenticated) {
//                 if (to.name !== "Login") {
//                         return { name: "Login" }
//                 }
//         }
//         // else {
//         //         axios.get("video/getInfo", {
//         //                 headers: {
//         //                         'Authorization': "Bearer " + localStorage.getItem("token"),
//         //                 },
//         //         }).then(() => {
//         //         }).catch(() => {
//         //                 localStorage.removeItem("token")
//         //                 router.push({
//         //                         name: "Login"
//         //                 })
//         //         })
//         //         axios.defaults.headers.Authorization = "Bearer " + isAuthenticated
//         // }
// })
app.mount("#app")  

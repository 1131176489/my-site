import { createRouter, createWebHistory } from "vue-router"
import Image from "../components/Image.vue"
import Home from "../components/Home.vue"
import Login from "../components/Login.vue"
import Register from "../components/Register.vue"
import NotFound from "../components/NotFound.vue"
import step1 from "../components/step1.vue"
import step2 from "../components/step2.vue"

const routes = [
    { path: "/", component: Home, name: "Home" },
    { path: "/image", component: Image, name: "Image" },
    { path: "/login", component: Login, name: "Login" },
        {
                path: "/register", component: Register, name: "register",
                children: [
                        { path: "step1", component: step1, name: "step1" },
                        {path:  "step2", component: step2, name: "step2"}
                ]
        },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
let isAuthenticated = false
// router.beforeEach(async (to, from) => {
//     if (
//         // 检查用户是否已登录
//         !isAuthenticated &&
//         // ❗️ 避免无限重定向
//         to.name !== "Register"
//     ) {
//         // 将用户重定向到登录页面
//         return { name: "Register" }
//     }
// })

export default router
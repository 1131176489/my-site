import { createRouter, createWebHashHistory } from "vue-router"
import Image from "../components/Image.vue"
import Home from "../components/Home.vue"
import Login from "../components/Login.vue"
import Video from "../components/Video.vue"
import Register from "../components/Register.vue"
import NotFound from "../components/NotFound.vue"
import NewVideo from "../components/NewVideo.vue"
import Study from "../components/Study.vue"
import step1 from "../components/step1.vue"
import step2 from "../components/step2.vue"
import step3 from "../components/step3.vue"
const routes = [
        { path: "/", component: Home, name: "Home" },
        { path: "/video", component: Video, name: "Video" },
        { path: "/study", component: Study, name: "Study" },
        { path: "/login", component: Login, name: "Login" },
        { path: "/newvideo", component: NewVideo, name: "NewVideo" },
        {
                path: "/register", component: Register, name: "Register",
                children: [
                        { path: "step1", component: step1, name: "step1" },
                        { path: "step2", component: step2, name: "step2" },
                        {path:  "step3", component: step3, name: "step3"},
                ]
        },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router
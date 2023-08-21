import { createRouter, createWebHashHistory } from "vue-router"
import Home from "../components/Home.vue"
import Login from "../components/Login.vue"
import NotFound from "../components/NotFound.vue"
import NewVideo from "../components/NewVideo.vue"
import NewVideo2 from "../components/NewVideo2.vue"
import M3U8 from "../components/M3U8.vue"
import Study from "../components/Study.vue"
import Calendar from "../components/Calendar.vue"
import FLV from "../components/FLV.vue"
const routes = [
        { path: "/", component: Home, name: "Home" },
        { path: "/calendar", component: Calendar, name: "Calendar" },
        { path: "/flv", component: FLV, name: "FLV" },
        { path: "/study", component: Study, name: "Study" },
        { path: "/login", component: Login, name: "Login" },
        { path: "/newvideo", component: NewVideo, name: "NewVideo" },
        { path: "/newvideo2", component: NewVideo2, name: "NewVideo2" },
        { path: "/m3u8", component: M3U8, name: "M3U8" },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router
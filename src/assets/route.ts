import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router"
import Home from "../components/Home.vue"
import NotFound from "../components/NotFound.vue"
import FileDownLoad from "../components/FileDownLoad.vue"
import VideoInfo from "../components/VideoInfo.vue";
import AnnualFeeCalculation from "../components/AnnualFeeCalculation.vue";
import WordCopy from "../components/WordCopy.vue";

const routes: Readonly<RouteRecordRaw[]> = [
    {path: "/", component: Home, name: "Home"},
    {path: "/FileDownLoad", component: FileDownLoad, name: "FileDownLoad"},
    {path: "/VideoInfo", component: VideoInfo, name: "VideoInfo"},
    {path: "/yearFee", component: AnnualFeeCalculation, name: "AnnualFeeCalculation"},
    {path: "/WordCopy", component: WordCopy, name: "WordCopy"},
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound},
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router
import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router"
import Home from "../components/Home.vue"
import Login from "../components/Login.vue"
import NotFound from "../components/NotFound.vue"
import NewVideo from "../components/NewVideo.vue"
import M3U8Video from "../components/M3U8Video.vue"
import M3U8 from "../components/M3U8.vue"
import NonM3U8Player from "../components/NonM3U8Player.vue"
import FLV from "../components/FLV.vue"
import Study from "../components/Study.vue"
import Calendar from "../components/Calendar.vue"
import NonM3U8Video from "../components/NonM3U8Video.vue"
import FileDownLoad from "../components/FileDownLoad.vue"
import VideoInfo from "../components/VideoInfo.vue";
import NewVideo2 from "../components/NewVideo2.vue";
import AnnualFeeCalculation from "../components/AnnualFeeCalculation.vue";
import SelectDirectory from "../components/SelectDirectory.vue";
import PlanDetail from "../components/PlanDetail.vue";
import YearStatistics from "../components/YearStatistics.vue";
import JapaneseWordIndex from "../components/JapaneseWordIndex.vue";
import JapaneseWordDetail from "../components/JapaneseWordDetail.vue";

const routes: Readonly<RouteRecordRaw[]> = [
    {path: "/", component: Home, name: "Home"},
    {
        path: "/calendar",
        component: Calendar,
        name: "Calendar",
        children: [
            {
                component:PlanDetail,
                path:'detail',
                name:"CalendarDetail"
            }
        ],
    },
    {path: "/FileDownLoad", component: FileDownLoad, name: "FileDownLoad"},
    {path: "/yearStatistics", component: YearStatistics, name: "YearStatistics"},
    {path: "/plan-detail", component: PlanDetail, name: "plan-detail"},
    {path: "/NonM3U8Player", component: NonM3U8Player, name: "NonM3U8Player"},
    {path: "/NonM3U8Video", component: NonM3U8Video, name: "NonM3U8Video"},
    {path: "/flv", component: FLV, name: "FLV"},
    {path: "/study", component: Study, name: "Study"},
    {path: "/login", component: Login, name: "Login"},
    {path: "/newvideo", component: NewVideo, name: "NewVideo"},
    {path: "/NewVideo2", component: NewVideo2, name: "NewVideo2"},
    {path: "/M3U8Video", component: M3U8Video, name: "M3U8Video"},
    {path: "/m3u8", component: M3U8, name: "M3U8"},
    {path: "/VideoInfo", component: VideoInfo, name: "VideoInfo"},
    {path: "/yearFee", component: AnnualFeeCalculation, name: "AnnualFeeCalculation"},
    {path: "/SelectDirectory", component: SelectDirectory, name: "SelectDirectory"},
    {path: "/JapaneseWordIndex", component: JapaneseWordIndex, name: "JapaneseWordIndex"},
    {path: "/JapaneseWordDetail", component: JapaneseWordDetail, name: "JapaneseWordDetail"},
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound},
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router
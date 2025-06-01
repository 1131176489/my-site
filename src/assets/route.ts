import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router"
import Home from "../components/Home.vue"
import NotFound from "../components/NotFound.vue"
import Calendar from "../components/Calendar.vue"
import FileDownLoad from "../components/FileDownLoad.vue"
import VideoInfo from "../components/VideoInfo.vue";
import AnnualFeeCalculation from "../components/AnnualFeeCalculation.vue";
import SelectDirectory from "../components/SelectDirectory.vue";
import PlanDetail from "../components/PlanDetail.vue";
import YearStatistics from "../components/YearStatistics.vue";
import JapaneseWordIndex from "../components/JapaneseWordIndex.vue";
import JapaneseWordDetail from "../components/JapaneseWordDetail.vue";
import WordCopy from "../components/WordCopy.vue";

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
    {path: "/VideoInfo", component: VideoInfo, name: "VideoInfo"},
    {path: "/yearFee", component: AnnualFeeCalculation, name: "AnnualFeeCalculation"},
    {path: "/SelectDirectory", component: SelectDirectory, name: "SelectDirectory"},
    {path: "/JapaneseWordIndex", component: JapaneseWordIndex, name: "JapaneseWordIndex"},
    {path: "/JapaneseWordDetail", component: JapaneseWordDetail, name: "JapaneseWordDetail"},
    {path: "/WordCopy", component: WordCopy, name: "WordCopy"},
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound},
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router
import { defineStore } from 'pinia'
interface Tree {
    label: string
    children?: Tree[]
}
interface lastVideoMsg {
    label: string,
    time: string,
    labelparent: string
}
export const myStore = defineStore('myStore', {
    state: () => {
        return {
            mydata: {} as Tree[],
            currentVideo: '' as string,
            currentPlayList: {} as Tree,
            currentVideoParent: '' as string,
            currentHeightLight: '' as string,
            playInfo: {} as lastVideoMsg,
            srcBaseUrl: "http://192.168.0.106:9000/",
            src: "",
            index: 0,


            playListLabel: '' as string,
            playListLabelList: [] as Tree[],
            url:"",
        }
    }
})
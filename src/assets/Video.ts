import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useVideoStore = defineStore('VideoStore', () => {
        let currentVideoList = ref()
        let currentVideoPath= ref("")

        return { currentVideoList, currentVideoPath }
})
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

interface Tree {
        id: number,
        label: string,
        timestamp?: number,
        children?: Tree[],
        value: string,
        parent?: string,
        pic?: {
                src:string
        }[]
}
interface Info {
        _id: string,
        insertId: number,
        useremail: string,
        data:Tree[]
}
export const useStudyStore = defineStore("Study", () => {
        const checkNode:number[] = reactive([])
        const node = ref<Tree | null>(null)
        const childrenNode:Tree = reactive({} as Tree)
        const info: Info = reactive({}as Info)
        const key = ref("")
        const value = ref("")
        const clearKeyValue = () => {
                key.value = ""
                value.value = ""
        }
        const setKeyValue = (key_:string,value_:string) => {
                key.value = key_
                value.value = value_
        }
        return {
                info,
                key,
                value,
                node,
                childrenNode,
                checkNode,
                clearKeyValue,
                setKeyValue,
        }
})
export type {Tree,Info}
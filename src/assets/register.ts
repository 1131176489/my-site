import { defineStore } from 'pinia'
import { ref } from 'vue'


export const registerStore = defineStore('register', () =>{
        const emailParam = ref("")
        const set_emailParam = (p:string) :void=> {
                emailParam.value = p
        }
        return {
                emailParam,
                set_emailParam,
        }
})
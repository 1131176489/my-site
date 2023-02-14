import { defineStore } from 'pinia'
import { ref } from 'vue'

export const globalStore = defineStore('global', () =>{
        const isAuthenticated = ref("")
        const userinfo = ref<any>({
        })
        const set_isAuthenticated = (p:string)=>{
                isAuthenticated.value = p
        }
        const get_isAuthenticated = ()=>{
              return isAuthenticated.value
      }
        return {
                set_isAuthenticated,
                get_isAuthenticated,
                userinfo,
        }
})
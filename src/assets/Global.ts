import { defineStore } from 'pinia'
import { ref } from 'vue'

export const globalStore = defineStore('global', () =>{
        const isAuthenticated = ref("")
        const userEmail = ref("")
        const userinfo = ref(({} as any))
        const set_isAuthenticated = (p:string)=>{
                isAuthenticated.value = p
        }
        const get_isAuthenticated = ()=>{
              return isAuthenticated.value
        }
        const set_userEmail = (userEmail_:string)=>{
                userEmail.value = userEmail_
        }
        const get_userEmail = () => {
                return userEmail.value
        }
        return {
                set_isAuthenticated,
                get_isAuthenticated,
                userinfo,
                set_userEmail,
                get_userEmail
        }
})
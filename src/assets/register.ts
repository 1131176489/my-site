import { defineStore } from 'pinia'
import { ref } from 'vue'


export const registerStore = defineStore('register', () =>{
        const email = ref("")
        const step = ref(2)
        const set_emailParam = (p:string) :void=> {
                email.value = p
        }
        const get_emailParam = () => {
                return email.value 
        }
        const set_step = (p:number) :void=> {
                step.value = p
        }
        const get_step = () => {
                return step.value 
        }
        return {
                set_emailParam,
                get_emailParam,
                step,
                set_step,
                get_step,
        }
})
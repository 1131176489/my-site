import { defineStore } from 'pinia'

export const Study = defineStore("Study", {
    state: () => {
        return {
            text: "11111111111111111",
        }
    },
    actions: {
        getText() {
            return this.text
        },
        setText(arg:string) {
            this.text = arg
        }
    }
})
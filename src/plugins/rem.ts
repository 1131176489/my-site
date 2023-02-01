import { App } from "vue"

export default {
    install: (app: App) => {
        // 在这里编写插件代码
        app.config.globalProperties.$rem = () => {
            // const scale = document.documentElement.clientWidth / 100
        //     console.log(document.documentElement.clientWidth)
            // document.documentElement.style.fontSize = scale + "px"
            window.onresize = app.config.globalProperties.$rem
            
        }
    }
}
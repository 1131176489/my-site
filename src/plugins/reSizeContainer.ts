import { App } from "vue"

export default {
    install: (app: App) => {
        // 在这里编写插件代码
        app.config.globalProperties.$reSizeContainer = () => {
            setTimeout(() => {
                let offsetHeight_ = (window.document.documentElement as HTMLElement).offsetHeight
                let headerHeight = (window.document.documentElement.getElementsByClassName("header")[0] as HTMLElement).scrollHeight
                let container = <HTMLElement>window.document.documentElement.getElementsByClassName("container")[0]
                container.style.height = offsetHeight_ - headerHeight + "px"
                // console.log(container.style.height)
            }, 100)
        }
    }
}
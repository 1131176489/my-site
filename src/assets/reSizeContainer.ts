import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
export function reSizeContainer() {
    setTimeout(() => {
        let offsetHeight_ = (window.document.documentElement as HTMLElement).offsetHeight
        let headerHeight = (window.document.documentElement.getElementsByClassName("header")[0] as HTMLElement).scrollHeight
        let container = <HTMLElement>window.document.documentElement.getElementsByClassName("container")[0]
        container.style.height = offsetHeight_ - headerHeight + "px"
        console.log(container.style.height)
    }, 50)
}
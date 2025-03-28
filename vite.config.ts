import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import path from 'path'
import {resolve} from 'path'
// https://vitejs.dev/config/
export default defineConfig({
    build: {
        emptyOutDir:true,
        outDir:"d:/static/dist",
        minify: 'terser',
        terserOptions: {
            compress: {
                // drop_console: true,
                // drop_debugger: true,
            },
        },
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                // video: resolve(__dirname, 'video/video.html'),
            },
        },
    },
    base:"./",
    server: {
        host: true,
        proxy:{
            '/BilibiliVideo':{
                target:"http://localhost",
                changeOrigin:true,
            },
            '/file':{
                target:"http://localhost",
                changeOrigin:true,
            },
        }
    },
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        }
    },
    plugins: [
        vue(),
        ElementPlus({}),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
})

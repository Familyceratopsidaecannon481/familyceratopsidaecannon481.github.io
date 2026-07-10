import DefaultTheme from 'vitepress/theme'
import imageViewer from 'vitepress-plugin-image-viewer'
import { useRoute } from 'vitepress'

import './custom.css'
import 'viewerjs/dist/viewer.min.css'

export default {
    ...DefaultTheme,
    setup() {
        const route = useRoute()
        imageViewer(route)
    }
}
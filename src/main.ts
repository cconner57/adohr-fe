import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { useScrollReveal } from './composables/useScrollReveal'
import router from './router/index'
import { setupFetchInterceptor } from './utils/fetchInterceptor'

const app = createApp(App)

const { vScrollReveal } = useScrollReveal()
app.directive('scroll-reveal', vScrollReveal)

app.use(createPinia())
app.use(router)

setupFetchInterceptor()

app.mount('#app')

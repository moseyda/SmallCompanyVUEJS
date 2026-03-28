import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router, { installAuthGuard } from './router'
import { useUiStore } from './stores/ui'
import { useAuthStore } from './stores/auth'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
installAuthGuard(router, pinia)
app.use(router)

const uiStore = useUiStore(pinia)
uiStore.initTheme()

const authStore = useAuthStore(pinia)
authStore.initAuth()

app.mount('#app')
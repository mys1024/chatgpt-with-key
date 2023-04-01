import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import routes from '~pages'

import '@unocss/reset/tailwind.css'
import './styles.less'
import 'uno.css'

const app = createApp(App)

// router
const router = createRouter({
  history: createWebHistory(),
  routes,
})
app.use(router)

// pinia
const pinia = createPinia()
app.use(pinia)

// mount
app.mount('#app')

<template>
  <div class="app-shell">
    <SidebarVue v-if="isAuthenticated" />
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import SidebarVue from './components/Sidebar.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
</script>

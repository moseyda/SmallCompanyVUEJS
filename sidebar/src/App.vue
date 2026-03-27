<template>
  <div class="app-shell">
    <SidebarVue />
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import SidebarVue from './components/Sidebar.vue'
</script>

import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarExpanded: localStorage.getItem('is_expanded') !== 'false',
    isMobileMenuOpen: false
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded
      localStorage.setItem('is_expanded', String(this.isSidebarExpanded))
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    }
  }
})

import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarExpanded: localStorage.getItem('is_expanded') !== 'false',
    isMobileMenuOpen: false,
    theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
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
    },
    initTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
    },
    setTheme(theme) {
      this.theme = theme === 'dark' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
      document.documentElement.setAttribute('data-theme', this.theme)
    }
  }
})

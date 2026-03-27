import { defineStore } from 'pinia'

const THEME_KEY = 'theme'
const DENSITY_KEY = 'density'
const MOTION_KEY = 'motion'

function normalizeTheme(value) {
  return ['light', 'dark', 'system'].includes(value) ? value : 'system'
}

function normalizeDensity(value) {
  return value === 'compact' ? 'compact' : 'comfortable'
}

function normalizeMotion(value) {
  return value === 'reduced' ? 'reduced' : 'full'
}

function resolveSystemTheme(theme) {
  if (theme !== 'system') {
    return theme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarExpanded: localStorage.getItem('is_expanded') !== 'false',
    isMobileMenuOpen: false,
    theme: normalizeTheme(localStorage.getItem(THEME_KEY)),
    density: normalizeDensity(localStorage.getItem(DENSITY_KEY)),
    motion: normalizeMotion(localStorage.getItem(MOTION_KEY))
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
      this.applyTheme()
      this.applyDensity()
      this.applyMotion()
    },
    setTheme(theme) {
      this.theme = normalizeTheme(theme)
      localStorage.setItem(THEME_KEY, this.theme)
      this.applyTheme()
    },
    setDensity(density) {
      this.density = normalizeDensity(density)
      localStorage.setItem(DENSITY_KEY, this.density)
      this.applyDensity()
    },
    setMotion(motion) {
      this.motion = normalizeMotion(motion)
      localStorage.setItem(MOTION_KEY, this.motion)
      this.applyMotion()
    },
    applyTheme() {
      document.documentElement.setAttribute('data-theme', resolveSystemTheme(this.theme))
      document.documentElement.setAttribute('data-theme-mode', this.theme)
    },
    applyDensity() {
      document.documentElement.setAttribute('data-density', this.density)
    },
    applyMotion() {
      document.documentElement.setAttribute('data-motion', this.motion)
    }
  }
})

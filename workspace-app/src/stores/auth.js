import { defineStore } from 'pinia'
import { api } from '../api/client'

const AUTH_STORAGE_KEY = 'auth_user'

function readStoredUser() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: readStoredUser(),
    isLoading: false,
    error: null,
    initialized: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser),
    hasPermission: (state) => (permission) => {
      return Boolean(state.currentUser?.permissions?.includes(permission))
    },
    canEditSettings() {
      return this.hasPermission('settings:write')
    }
  },
  actions: {
    setUser(user) {
      this.currentUser = user

      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    },
    async initAuth() {
      if (this.initialized) {
        return
      }

      this.initialized = true
      this.error = null

      try {
        const data = await api.getAuthSession()
        this.setUser(data.user ?? null)
      } catch {
        this.error = 'Unable to verify session.'
      }
    },
    async login(email, password) {
      this.isLoading = true
      this.error = null

      try {
        const data = await api.login({ email, password })
        this.setUser(data.user)
      } catch (error) {
        this.error = error?.message || 'Unable to sign in.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async logout() {
      this.isLoading = true
      this.error = null

      try {
        await api.logout()
      } finally {
        this.setUser(null)
        this.isLoading = false
      }
    }
  }
})

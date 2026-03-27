import { defineStore } from 'pinia'
import { api } from '../api/client'

const defaults = {
  name: 'Project Lead',
  email: 'lead@smallcompany.io',
  cadence: 'Bi-weekly',
  notifyEmail: true,
  notifyPush: true,
  shareSummary: false
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    profile: { ...defaults },
    isLoading: false,
    error: null,
    loaded: false,
    saveState: 'idle'
  }),
  actions: {
    async fetchSettings(force = false) {
      if (this.loaded && !force) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const data = await api.getSettings()
        this.profile = {
          ...defaults,
          ...data.settings
        }
        this.loaded = true
      } catch (error) {
        this.error = error?.message || 'Unable to load settings'
      }

      this.isLoading = false
    },
    async saveSettings() {
      this.isLoading = true
      this.error = null
      this.saveState = 'saving'

      try {
        const data = await api.updateSettings(this.profile)
        this.profile = {
          ...defaults,
          ...data.settings
        }
        this.saveState = 'saved'
      } catch (error) {
        this.error = error?.message || 'Unable to save settings'
        this.saveState = 'error'
      }

      this.isLoading = false
    }
  }
})

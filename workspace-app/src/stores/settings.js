import { defineStore } from 'pinia'
import { api } from '../api/client'

const defaults = {
  name: 'Project Lead',
  email: 'lead@vulnlaunch.io',
  cadence: 'Fortnightly',
  notifyEmail: true,
  notifyPush: true,
  shareSummary: false,
  githubApp: {
    installationId: null,
    owner: '',
    repo: '',
    baseBranch: 'main'
  },
  // Support multiple repo mappings for GitHub App installations
  githubAppMappings: []
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
        this.error = error?.isUnauthorized
          ? 'Sign-in required to load settings.'
          : error?.isForbidden
            ? 'You do not have permission to view settings.'
          : (error?.message || 'Unable to load settings')
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
        this.error = error?.isUnauthorized
          ? 'Sign-in required to save settings.'
          : error?.isForbidden
            ? 'You do not have permission to update settings.'
          : (error?.message || 'Unable to save settings')
        this.saveState = 'error'
      }

      this.isLoading = false
    }

      ,

    // Update GitHub App mappings and persist settings
    async updateGithubAppMappings(mappings) {
      this.profile.githubAppMappings = mappings || []
      try {
        await this.saveSettings()
        return true
      } catch (e) {
        this.error = e?.message || 'Failed to save GitHub App mappings.'
        return false
      }
    }
  }
})

import { defineStore } from 'pinia'
import { api } from '../api/client'

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    kpis: [],
    initiatives: [],
    projects: [],
    services: [],
    insightSignals: [],
    actions: [],
    milestones: [],
    teamMembers: [],
    offices: [],
    isLoading: false,
    error: null,
    loaded: {
      overview: false,
      projects: false,
      services: false,
      insights: false,
      milestones: false,
      teamMembers: false,
      offices: false
    }
  }),
  actions: {
    startRequest() {
      this.isLoading = true
      this.error = null
    },
    endRequest() {
      this.isLoading = false
    },
    failRequest(error) {
      this.error = error?.message || 'Unknown API error'
      this.isLoading = false
    },
    async fetchOverview(force = false) {
      if (this.loaded.overview && !force) {
        return
      }

      this.startRequest()
      try {
        const data = await api.getOverview()
        this.kpis = data.kpis
        this.projects = data.projects
        this.initiatives = data.initiatives
        this.loaded.overview = true
      } catch (error) {
        this.failRequest(error)
        return
      }
      this.endRequest()
    },
    async fetchProjects(force = false) {
      if (this.loaded.projects && !force) {
        return
      }

      this.startRequest()
      try {
        const data = await api.getProjects()
        this.projects = data.projects
        this.loaded.projects = true
      } catch (error) {
        this.failRequest(error)
        return
      }
      this.endRequest()
    },
    async fetchServices(force = false) {
      if (this.loaded.services && !force) {
        return
      }

      this.startRequest()
      try {
        const data = await api.getServices()
        this.services = data.services
        this.loaded.services = true
      } catch (error) {
        this.failRequest(error)
        return
      }
      this.endRequest()
    },
    async fetchInsights(force = false) {
      if (this.loaded.insights && !force) {
        return
      }

      this.startRequest()
      try {
        const data = await api.getInsights()
        this.insightSignals = data.insightSignals
        this.actions = data.actions
        this.loaded.insights = true
      } catch (error) {
        this.failRequest(error)
        return
      }
      this.endRequest()
    },
    async fetchMilestones(force = false) {
      if (this.loaded.milestones && !force) {
        return
      }

      this.startRequest()
      try {
        const data = await api.getMilestones()
        this.milestones = data.milestones
        this.loaded.milestones = true
      } catch (error) {
        this.failRequest(error)
        return
      }
      this.endRequest()
    },
    async fetchTeamMembers(force = false) {
      if (this.loaded.teamMembers && !force) {
        return
      }

      this.startRequest()
      try {
        const data = await api.getTeamMembers()
        this.teamMembers = data.teamMembers
        this.loaded.teamMembers = true
      } catch (error) {
        this.failRequest(error)
        return
      }
      this.endRequest()
    },
    async fetchOffices(force = false) {
      if (this.loaded.offices && !force) {
        return
      }

      this.startRequest()
      try {
        const data = await api.getOffices()
        this.offices = data.offices
        this.loaded.offices = true
      } catch (error) {
        this.failRequest(error)
        return
      }
      this.endRequest()
    },
    async submitInquiry(inquiry) {
      this.startRequest()
      try {
        await api.submitInquiry(inquiry)
      } catch (error) {
        this.failRequest(error)
        throw error
      }
      this.endRequest()
    }
  }
})

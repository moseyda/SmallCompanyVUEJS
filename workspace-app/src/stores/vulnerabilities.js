import { defineStore } from 'pinia'
import { api } from '../api/client'

/**
 * Vulnerability & Issue Management Store
 * Handles vulnerability details, tracking, and remediation workflows
 */
export const useVulnerabilitiesStore = defineStore('vulnerabilities', {
  state: () => ({
    // Main vulnerabilities list
    vulnerabilities: [],
    currentVulnerability: null,
    
    // Issue tracking
    issues: {},  // vuln_id -> [issue objects]
    
    // Remediation tracking
    remediations: {},  // vuln_id -> remediation object
    
    // Loading & error states
    isLoading: false,
    error: null,
    
    // Filters
    filterStatus: 'all',  // all, open, in-progress, fixed, closed
    filterPriority: 'all'  // all, critical, high, medium, low
  }),

  getters: {
    // Get vulnerability by ID
    getVulnerabilityById: (state) => (id) => {
      return state.vulnerabilities.find(v => v.id === id)
    },
    
    // Get issues for a vulnerability
    getIssuesForVulnerability: (state) => (vulnId) => {
      return state.issues[vulnId] || []
    },
    
    // Get remediation for a vulnerability
    getRemediationForVulnerability: (state) => (vulnId) => {
      return state.remediations[vulnId] || null
    },
    
    // Get filtered vulnerabilities
    getFilteredVulnerabilities: (state) => {
      return state.vulnerabilities.filter(v => {
        const statusMatch = state.filterStatus === 'all' || v.status === state.filterStatus
        const priorityMatch = state.filterPriority === 'all' || v.priority === state.filterPriority
        return statusMatch && priorityMatch
      })
    },
    
    // Get summary stats
    getSummaryStats: (state) => {
      const stats = {
        total: state.vulnerabilities.length,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        open: 0,
        inProgress: 0,
        fixed: 0,
        closed: 0
      }
      
      state.vulnerabilities.forEach(v => {
        stats[v.priority]++
        stats[v.status === 'in-progress' ? 'inProgress' : v.status]++
      })
      
      return stats
    }
  },

  actions: {
    // Load vulnerabilities from API
    async loadVulnerabilities() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.getVulnerabilities()
        this.vulnerabilities = response.vulnerabilities || []
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    // Load specific vulnerability details from API
    async loadVulnerabilityDetails(vulnId) {
      this.isLoading = true
      this.error = null
      
      try {
        const vulnResponse = await api.getVulnerability(vulnId)
        this.currentVulnerability = vulnResponse.vulnerability
        
        // Load related issues and remediations
        await this.loadIssuesForVulnerability(vulnId)
        await this.loadRemediationForVulnerability(vulnId)
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    // Load issues for a vulnerability from API
    async loadIssuesForVulnerability(vulnId) {
      try {
        const response = await api.getIssues(vulnId)
        this.issues[vulnId] = response.issues || []
      } catch (err) {
        this.error = err.message
      }
    },

    // Load remediation for a vulnerability from API
    async loadRemediationForVulnerability(vulnId) {
      try {
        const response = await api.getRemediation(vulnId)
        this.remediations[vulnId] = response.remediation || null
      } catch (err) {
        this.error = err.message
      }
    },

    // Update issue status
    async updateIssueStatus(vulnId, issueId, newStatus) {
      try {
        const response = await api.updateIssue(vulnId, issueId, { status: newStatus })
        const issues = this.issues[vulnId] || []
        const issue = issues.find(i => i.id === issueId)
        if (issue && response.issue) {
          Object.assign(issue, response.issue)
        }
      } catch (err) {
        this.error = err.message
      }
    },

    // Update issue assignment
    async updateIssueAssignment(vulnId, issueId, assignedTo) {
      try {
        const response = await api.updateIssue(vulnId, issueId, { assignedTo })
        const issues = this.issues[vulnId] || []
        const issue = issues.find(i => i.id === issueId)
        if (issue && response.issue) {
          Object.assign(issue, response.issue)
        }
      } catch (err) {
        this.error = err.message
      }
    },

    // Add comment to issue
    async addCommentToIssue(vulnId, issueId, comment) {
      try {
        const response = await api.addComment(vulnId, issueId, { text: comment })
        const issues = this.issues[vulnId] || []
        const issue = issues.find(i => i.id === issueId)
        if (issue && response.comment) {
          issue.comments = issue.comments || []
          issue.comments.push(response.comment)
        }
      } catch (err) {
        this.error = err.message
      }
    },

    // Update vulnerability status
    async updateVulnerabilityStatus(vulnId, newStatus) {
      try {
        const response = await api.updateVulnerability(vulnId, { status: newStatus })
        const vuln = this.getVulnerabilityById(vulnId)
        if (vuln && response.vulnerability) {
          Object.assign(vuln, response.vulnerability)
        }
      } catch (err) {
        this.error = err.message
      }
    },

    // Create merge request for remediation (now accepts optional platform)
    async createMergeRequest(vulnId, fixId, branchName, platform = 'GitHub') {
      try {
        const response = await api.createMergeRequest(vulnId, {
          branchName,
          fixId,
          platform
        })
        if (this.remediations[vulnId] && response.pullRequest) {
          this.remediations[vulnId].pullRequests =
            this.remediations[vulnId].pullRequests || []
          this.remediations[vulnId].pullRequests.push(response.pullRequest)
          this.remediations[vulnId].status = 'in-progress'
        }
        return true
      } catch (err) {
        this.error = err.message
        return false
      }
    },

    // Persist remediation updates (e.g., mergeRequestIntegration changes)
    async updateRemediation(vulnId, data) {
      try {
        const response = await api.updateRemediation(vulnId, data)
        if (this.remediations[vulnId] && response.remediation) {
          Object.assign(this.remediations[vulnId], response.remediation)
        }
        return true
      } catch (err) {
        this.error = err.message
        return false
      }
    },

    // Update remediation progress
    async updateRemediationProgress(vulnId, newProgress) {
      try {
        const response = await api.updateRemediation(vulnId, { progress: newProgress })
        if (this.remediations[vulnId] && response.remediation) {
          Object.assign(this.remediations[vulnId], response.remediation)
        }
      } catch (err) {
        this.error = err.message
      }
    },

    // Set filter
    setStatusFilter(status) {
      this.filterStatus = status
    },

    setProperityFilter(priority) {
      this.filterPriority = priority
    }
  }
})

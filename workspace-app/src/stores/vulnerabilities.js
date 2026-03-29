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
    // Load vulnerabilities (mock implementation)
    async loadVulnerabilities() {
      this.isLoading = true
      this.error = null
      
      try {
        // Mock data - replace with actual API call
        this.vulnerabilities = [
          {
            id: 'vuln-001',
            title: 'SQL Injection in Login Form',
            description: 'User input is not properly sanitized before being used in SQL queries',
            severity: 'critical',
            priority: 'critical',
            status: 'open',
            cveId: 'CVE-2024-1234',
            affectedComponent: 'auth/login',
            detectedDate: new Date('2024-03-01'),
            codeSnippets: [
              {
                file: 'src/auth/login.js',
                language: 'javascript',
                lineStart: 45,
                lineEnd: 52,
                code: `const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
const result = await db.query(query);`
              }
            ],
            suggestedFix: 'Use parameterized queries with prepared statements to prevent SQL injection',
            relatedVulnerabilities: ['vuln-002'],
            dependencies: ['express', 'mysql2'],
            historicalData: {
              firstDetected: '2024-03-01',
              frequency: 3,
              similar: 2
            }
          },
          {
            id: 'vuln-002',
            title: 'Cross-Site Scripting (XSS)',
            description: 'User-supplied data is rendered without proper escaping',
            severity: 'high',
            priority: 'high',
            status: 'in-progress',
            cveId: 'CVE-2024-5678',
            affectedComponent: 'comments/display',
            detectedDate: new Date('2024-03-05'),
            codeSnippets: [
              {
                file: 'src/components/CommentDisplay.vue',
                language: 'vue',
                lineStart: 12,
                lineEnd: 18,
                code: `<div class="comment-text">
  {{ comment.text }}
</div>`
              }
            ],
            suggestedFix: 'Use Vue\'s built-in XSS protection or sanitize with DOMPurify',
            relatedVulnerabilities: ['vuln-001'],
            dependencies: ['vue'],
            historicalData: {
              firstDetected: '2024-02-15',
              frequency: 5,
              similar: 1
            }
          }
        ]
        
        // Initialize issues and remediations
        this.vulnerabilities.forEach(v => {
          if (!this.issues[v.id]) {
            this.issues[v.id] = []
          }
          if (!this.remediations[v.id]) {
            this.remediations[v.id] = null
          }
        })
        
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    // Load specific vulnerability details
    async loadVulnerabilityDetails(vulnId) {
      this.isLoading = true
      this.error = null
      
      try {
        const vuln = this.getVulnerabilityById(vulnId)
        if (vuln) {
          this.currentVulnerability = vuln
          
          // Load related issues
          await this.loadIssuesForVulnerability(vulnId)
          
          // Load remediation info
          await this.loadRemediationForVulnerability(vulnId)
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    // Load issues for a vulnerability
    async loadIssuesForVulnerability(vulnId) {
      // Mock issues - replace with API call
      this.issues[vulnId] = [
        {
          id: `issue-${vulnId}-001`,
          vulnId,
          title: 'Implement prepared statements',
          description: 'Convert all database queries to use parameterized/prepared statements',
          assignedTo: 'Alice Johnson',
          status: 'open',
          priority: 'critical',
          dueDate: new Date('2024-03-15'),
          createdDate: new Date('2024-03-01'),
          updatedDate: new Date('2024-03-08'),
          relatedIssueUrl: null,
          comments: []
        },
        {
          id: `issue-${vulnId}-002`,
          vulnId,
          title: 'Code review for database layer',
          description: 'Review all database queries for potential injection vulnerabilities',
          assignedTo: 'Bob Smith',
          status: 'open',
          priority: 'high',
          dueDate: new Date('2024-03-20'),
          createdDate: new Date('2024-03-01'),
          updatedDate: new Date('2024-03-07'),
          relatedIssueUrl: null,
          comments: []
        }
      ]
    },

    // Load remediation for a vulnerability
    async loadRemediationForVulnerability(vulnId) {
      const vuln = this.getVulnerabilityById(vulnId)
      if (vuln) {
        this.remediations[vulnId] = {
          id: `rem-${vulnId}`,
          vulnId,
          status: 'draft',  // draft, proposed, in-progress, completed
          progress: 30,
          suggestedFixes: [
            {
              id: 'fix-001',
              title: 'Primary: Use Prepared Statements',
              description: 'Convert raw SQL to parameterized queries using mysql2/promise',
              complexity: 'medium',
              estimatedTime: '2 hours',
              confidence: 0.95
            },
            {
              id: 'fix-002',
              title: 'Alternative: ORM Migration',
              description: 'Migrate database layer to TypeORM or Prisma',
              complexity: 'high',
              estimatedTime: '20 hours',
              confidence: 0.90
            }
          ],
          appliedFix: null,
          pullRequests: [],
          beforeCode: vuln.codeSnippets[0]?.code || '',
          afterCode: null,
          mergeRequestIntegration: {
            platform: 'github',
            enabled: false,
            autoCreate: false
          }
        }
      }
    },

    // Update issue status
    updateIssueStatus(vulnId, issueId, newStatus) {
      const issues = this.issues[vulnId] || []
      const issue = issues.find(i => i.id === issueId)
      if (issue) {
        issue.status = newStatus
        issue.updatedDate = new Date()
      }
    },

    // Update issue assignment
    updateIssueAssignment(vulnId, issueId, assignedTo) {
      const issues = this.issues[vulnId] || []
      const issue = issues.find(i => i.id === issueId)
      if (issue) {
        issue.assignedTo = assignedTo
        issue.updatedDate = new Date()
      }
    },

    // Add comment to issue
    addCommentToIssue(vulnId, issueId, comment) {
      const issues = this.issues[vulnId] || []
      const issue = issues.find(i => i.id === issueId)
      if (issue) {
        issue.comments.push({
          id: `comment-${Date.now()}`,
          author: 'Current User',
          text: comment,
          timestamp: new Date(),
          edited: false
        })
      }
    },

    // Update vulnerability status
    updateVulnerabilityStatus(vulnId, newStatus) {
      const vuln = this.getVulnerabilityById(vulnId)
      if (vuln) {
        vuln.status = newStatus
      }
    },

    // Create merge request for remediation
    async createMergeRequest(vulnId, fixId, branchName) {
      try {
        const remediation = this.remediations[vulnId]
        if (remediation) {
          remediation.pullRequests.push({
            id: `pr-${Date.now()}`,
            platform: 'github',
            url: `https://github.com/example/repo/pull/new/${branchName}`,
            status: 'draft',
            createdDate: new Date()
          })
          remediation.status = 'in-progress'
        }
        return true
      } catch (err) {
        this.error = err.message
        return false
      }
    },

    // Update remediation progress
    updateRemediationProgress(vulnId, newProgress) {
      if (this.remediations[vulnId]) {
        this.remediations[vulnId].progress = Math.min(100, Math.max(0, newProgress))
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

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.isUnauthorized = status === 401
    this.isForbidden = status === 403
  }
}

const request = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new ApiError(payload.error || `API request failed: ${response.status}`, response.status)
  }

  return response.json()
}

export const api = {
  getOverview: () => request('/api/overview'),
  getProjects: () => request('/api/projects'),
  getServices: () => request('/api/services'),
  getRulesets: () => request('/api/rulesets'),
  getInsights: () => request('/api/insights'),
  getMilestones: () => request('/api/milestones'),
  getTeamMembers: () => request('/api/team-members'),
  getOffices: () => request('/api/offices'),
  getAuthSession: () => request('/api/auth/session'),
  login: (credentials) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  logout: () =>
    request('/api/auth/logout', {
      method: 'POST'
    }),
  getSettings: () => request('/api/settings'),
  updateSettings: (settings) =>
    request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }),
  submitInquiry: (inquiry) =>
    request('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiry)
    }),

  // Vulnerabilities
  getVulnerabilities: () => request('/api/vulnerabilities'),
  getVulnerability: (id) => request(`/api/vulnerabilities/${id}`),
  updateVulnerability: (id, data) =>
    request(`/api/vulnerabilities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  // Issues
  getIssues: (vulnId) => request(`/api/vulnerabilities/${vulnId}/issues`),
  createIssue: (vulnId, issue) =>
    request(`/api/vulnerabilities/${vulnId}/issues`, {
      method: 'POST',
      body: JSON.stringify(issue)
    }),
  updateIssue: (vulnId, issueId, data) =>
    request(`/api/vulnerabilities/${vulnId}/issues/${issueId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  // Comments
  addComment: (vulnId, issueId, comment) =>
    request(`/api/vulnerabilities/${vulnId}/issues/${issueId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment)
    }),

  // Remediation
  getRemediation: (id) => request(`/api/vulnerabilities/${id}/remediation`),
  updateRemediation: (id, data) =>
    request(`/api/vulnerabilities/${id}/remediation`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  createMergeRequest: (id, data) =>
    request(`/api/vulnerabilities/${id}/remediation/merge-request`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
}

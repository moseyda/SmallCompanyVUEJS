class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.isUnauthorized = status === 401
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
    })
}

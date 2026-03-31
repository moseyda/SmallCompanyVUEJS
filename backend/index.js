import express from 'express'
import { fileURLToPath } from 'node:url'
import fs from 'fs'
import crypto from 'crypto'
import { defaultSettings, workspaceData, vulnerabilityData } from './data.js'

const port = 8787
// GitHub integration config (set in environment for real PR creation)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'example'
const GITHUB_REPO = process.env.GITHUB_REPO || 'repo'
const GITHUB_BASE_BRANCH = process.env.GITHUB_BASE_BRANCH || 'main'

// GitHub App (preferred for SaaS): configure APP ID and PRIVATE KEY or PRIVATE_KEY_PATH
const GITHUB_APP_ID = process.env.GITHUB_APP_ID || ''
let GITHUB_APP_PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY || ''
const GITHUB_APP_PRIVATE_KEY_PATH = process.env.GITHUB_APP_PRIVATE_KEY_PATH || ''

if (!GITHUB_APP_PRIVATE_KEY && GITHUB_APP_PRIVATE_KEY_PATH) {
  try {
    GITHUB_APP_PRIVATE_KEY = fs.readFileSync(GITHUB_APP_PRIVATE_KEY_PATH, 'utf8')
  } catch (e) {
    console.warn('Could not read GITHUB_APP_PRIVATE_KEY_PATH:', e.message)
  }
}

// Simple in-memory cache for installation tokens: installationId -> { token, expiresAt }
const installationTokens = {}

const base64Url = (input) => {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const createJwt = (appId, privateKey) => {
  const header = { alg: 'RS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = { iat: now - 60, exp: now + (10 * 60), iss: appId }
  const encodedHeader = base64Url(JSON.stringify(header))
  const encodedPayload = base64Url(JSON.stringify(payload))
  const data = `${encodedHeader}.${encodedPayload}`
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(data)
  signer.end()
  const signature = signer.sign(privateKey, 'base64')
  const encodedSig = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${data}.${encodedSig}`
}

const getInstallationToken = async (installationId) => {
  const cached = installationTokens[installationId]
  if (cached && cached.expiresAt && cached.expiresAt > Date.now() + 5000) {
    return cached.token
  }

  if (!GITHUB_APP_ID || !GITHUB_APP_PRIVATE_KEY) {
    throw new Error('GitHub App credentials not configured')
  }

  const jwt = createJwt(GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY)
  const url = `https://api.github.com/app/installations/${installationId}/access_tokens`
  const res = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${jwt}`, Accept: 'application/vnd.github.v3+json' } })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to create installation token: ${res.status} ${text}`)
  }
  const data = await res.json()
  const token = data.token
  const expiresAt = data.expires_at ? new Date(data.expires_at).getTime() : (Date.now() + 60 * 60 * 1000)
  installationTokens[installationId] = { token, expiresAt }
  return token
}

const listAppInstallations = async () => {
  if (!GITHUB_APP_ID || !GITHUB_APP_PRIVATE_KEY) throw new Error('GitHub App credentials not configured')
  const jwt = createJwt(GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY)
  const res = await fetch('https://api.github.com/app/installations', { headers: { Authorization: `Bearer ${jwt}`, Accept: 'application/vnd.github.v3+json' } })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to list installations: ${res.status} ${text}`)
  }
  return res.json()
}
const demoUsers = [
  {
    id: 'user_project_lead',
    name: 'Project Lead',
    email: 'lead@smallcompany.io',
    password: 'Passw0rd!',
    role: 'admin'
  },
  {
    id: 'user_product_editor',
    name: 'Product Editor',
    email: 'editor@smallcompany.io',
    password: 'Passw0rd!',
    role: 'editor'
  },
  {
    id: 'user_project_viewer',
    name: 'Project Viewer',
    email: 'viewer@smallcompany.io',
    password: 'Passw0rd!',
    role: 'viewer'
  }
]
const permissionsByRole = {
  admin: ['settings:read', 'settings:write'],
  editor: ['settings:read', 'settings:write'],
  viewer: ['settings:read']
}

const withLatency = (handler) => (req, res, next) => {
  setTimeout(() => {
    // Support both sync and async handlers
    Promise.resolve()
      .then(() => handler(req, res, next))
      .catch(next)
  }, 120)
}

export function createApp() {
  const app = express()
  let workspaceSettings = { ...defaultSettings }
  let currentSessionUser = null
  
  // Vulnerability management state
  let vulnerabilities = JSON.parse(JSON.stringify(vulnerabilityData))
  let issues = {}  // vulnId -> array of issues
  let remediations = {}  // vulnId -> remediation object
  let comments = {}  // issueId -> array of comments

  // Initialize issues, remediations, and comments for each vulnerability
  vulnerabilities.forEach(v => {
    issues[v.id] = [
      {
        id: `issue-${v.id}-001`,
        vulnId: v.id,
        title: 'Implement prepared statements',
        description: 'Convert all database queries to use parameterized/prepared statements',
        assignedTo: 'Alice Johnson',
        status: 'open',
        priority: 'critical',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdDate: new Date(),
        updatedDate: new Date(),
        comments: []
      },
      {
        id: `issue-${v.id}-002`,
        vulnId: v.id,
        title: 'Code review for security layer',
        description: 'Review all queries for potential injection vulnerabilities',
        assignedTo: 'Bob Smith',
        status: 'open',
        priority: 'high',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        createdDate: new Date(),
        updatedDate: new Date(),
        comments: []
      }
    ]

    remediations[v.id] = {
      id: `rem-${v.id}`,
      vulnId: v.id,
      status: 'draft',
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
      beforeCode: v.codeSnippets[0]?.code || '',
      afterCode: null,
      mergeRequestIntegration: {
        platform: 'github',
        enabled: false,
        autoCreate: false
      }
    }
  })

  const requireAuth = (req, res, next) => {
    if (!currentSessionUser) {
      res.status(401).json({ error: 'Sign-in required.' })
      return
    }

    req.user = currentSessionUser
    next()
  }

  const requirePermission = (permission) => (req, res, next) => {
    if (!currentSessionUser) {
      res.status(401).json({ error: 'Sign-in required.' })
      return
    }

    if (!currentSessionUser.permissions?.includes(permission)) {
      res.status(403).json({ error: 'Insufficient permissions.' })
      return
    }

    req.user = currentSessionUser
    next()
  }

  const formatSessionUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: permissionsByRole[user.role] || []
  })

  app.use(express.json())

  app.get('/api/overview', withLatency((req, res) => {
    res.json({
      kpis: workspaceData.kpis,
      projects: workspaceData.projects,
      initiatives: workspaceData.initiatives
    })
  }))

  app.get('/api/projects', withLatency((req, res) => {
    res.json({ projects: workspaceData.projects })
  }))

  app.get('/api/services', withLatency((req, res) => {
    res.json({ services: workspaceData.services })
  }))

  app.get('/api/insights', withLatency((req, res) => {
    res.json({
      insightSignals: workspaceData.insightSignals,
      actions: workspaceData.insightActions
    })
  }))

  app.get('/api/milestones', withLatency((req, res) => {
    res.json({ milestones: workspaceData.milestones })
  }))

  app.get('/api/team-members', withLatency((req, res) => {
    res.json({ teamMembers: workspaceData.teamMembers })
  }))

  app.get('/api/rulesets', withLatency((req, res) => {
    res.json({ rulesets: workspaceData.rulesets })
  }))

  app.get('/api/offices', withLatency((req, res) => {
    res.json({ offices: workspaceData.offices })
  }))

  app.get('/api/auth/session', withLatency((req, res) => {
    res.json({ user: currentSessionUser })
  }))

  app.post('/api/auth/login', withLatency((req, res) => {
    const { email, password } = req.body ?? {}
    const matchedUser = demoUsers.find((user) => user.email === email && user.password === password)

    if (!matchedUser) {
      res.status(401).json({ error: 'Invalid sign-in credentials.' })
      return
    }

    currentSessionUser = formatSessionUser(matchedUser)
    res.status(200).json({ user: currentSessionUser })
  }))

  app.post('/api/auth/logout', withLatency((req, res) => {
    currentSessionUser = null
    res.status(200).json({ status: 'signed_out' })
  }))

  app.get('/api/settings', requirePermission('settings:read'), withLatency((req, res) => {
    res.json({ settings: workspaceSettings })
  }))

  app.put('/api/settings', requirePermission('settings:write'), withLatency((req, res) => {
    workspaceSettings = {
      ...workspaceSettings,
      ...req.body
    }

    res.json({ settings: workspaceSettings })
  }))

  app.post('/api/inquiries', withLatency((req, res) => {
    const { name, email, scope, message } = req.body ?? {}

    if (!name || !email || !scope || !message) {
      res.status(400).json({ error: 'Missing required enquiry fields.' })
      return
    }

    res.status(201).json({ status: 'received' })
  }))

  // Vulnerability endpoints
  app.get('/api/vulnerabilities', requireAuth, withLatency((req, res) => {
    res.json({ vulnerabilities })
  }))

  app.get('/api/vulnerabilities/:id', requireAuth, withLatency((req, res) => {
    const vuln = vulnerabilities.find(v => v.id === req.params.id)
    if (!vuln) {
      res.status(404).json({ error: 'Vulnerability not found' })
      return
    }
    res.json({ vulnerability: vuln })
  }))

  app.patch('/api/vulnerabilities/:id', requireAuth, withLatency((req, res) => {
    const vuln = vulnerabilities.find(v => v.id === req.params.id)
    if (!vuln) {
      res.status(404).json({ error: 'Vulnerability not found' })
      return
    }
    
    if (req.body.status) {
      vuln.status = req.body.status
    }
    res.json({ vulnerability: vuln })
  }))

  // Issue endpoints (for vulnerabilities)
  app.get('/api/vulnerabilities/:vulnId/issues', requireAuth, withLatency((req, res) => {
    const vulnIssues = issues[req.params.vulnId] || []
    res.json({ issues: vulnIssues })
  }))

  app.post('/api/vulnerabilities/:vulnId/issues', requireAuth, withLatency((req, res) => {
    const { title, description, priority, assignedTo, dueDate } = req.body ?? {}
    
    if (!title) {
      res.status(400).json({ error: 'Issue title is required' })
      return
    }

    if (!issues[req.params.vulnId]) {
      issues[req.params.vulnId] = []
    }

    const newIssue = {
      id: `issue-${req.params.vulnId}-${Date.now()}`,
      vulnId: req.params.vulnId,
      title,
      description: description || '',
      assignedTo: assignedTo || null,
      status: 'open',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      createdDate: new Date(),
      updatedDate: new Date(),
      comments: []
    }

    issues[req.params.vulnId].push(newIssue)
    res.status(201).json({ issue: newIssue })
  }))

  app.patch('/api/vulnerabilities/:vulnId/issues/:issueId', requireAuth, withLatency((req, res) => {
    const vulnIssues = issues[req.params.vulnId]
    if (!vulnIssues) {
      res.status(404).json({ error: 'No issues found for this vulnerability' })
      return
    }

    const issue = vulnIssues.find(i => i.id === req.params.issueId)
    if (!issue) {
      res.status(404).json({ error: 'Issue not found' })
      return
    }

    if (req.body.status) issue.status = req.body.status
    if (req.body.priority) issue.priority = req.body.priority
    if (req.body.assignedTo) issue.assignedTo = req.body.assignedTo
    if (req.body.dueDate) issue.dueDate = new Date(req.body.dueDate)
    
    issue.updatedDate = new Date()
    res.json({ issue })
  }))

  // Comment endpoints (on issues)
  app.post('/api/vulnerabilities/:vulnId/issues/:issueId/comments', requireAuth, withLatency((req, res) => {
    const { text } = req.body ?? {}
    
    if (!text) {
      res.status(400).json({ error: 'Comment text is required' })
      return
    }

    const vulnIssues = issues[req.params.vulnId]
    if (!vulnIssues) {
      res.status(404).json({ error: 'No issues found for this vulnerability' })
      return
    }

    const issue = vulnIssues.find(i => i.id === req.params.issueId)
    if (!issue) {
      res.status(404).json({ error: 'Issue not found' })
      return
    }

    const newComment = {
      id: `comment-${Date.now()}`,
      author: currentSessionUser.name,
      text,
      timestamp: new Date(),
      edited: false
    }

    issue.comments.push(newComment)
    res.status(201).json({ comment: newComment })
  }))

  // --- GitHub App helper endpoints (admin) ---
  app.get('/api/github/app/installations', requireAuth, withLatency(async (req, res) => {
    try {
      const installations = await listAppInstallations()
      res.json({ installations })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }))

  app.post('/api/github/app/installations/:installationId/token', requireAuth, withLatency(async (req, res) => {
    try {
      const token = await getInstallationToken(req.params.installationId)
      res.json({ token })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }))

  // Remediation endpoints
  app.get('/api/vulnerabilities/:id/remediation', requireAuth, withLatency((req, res) => {
    const remediation = remediations[req.params.id]
    if (!remediation) {
      res.status(404).json({ error: 'Remediation not found' })
      return
    }
    res.json({ remediation })
  }))

  app.patch('/api/vulnerabilities/:id/remediation', requireAuth, withLatency((req, res) => {
    const remediation = remediations[req.params.id]
    if (!remediation) {
      res.status(404).json({ error: 'Remediation not found' })
      return
    }

    if (req.body.status) remediation.status = req.body.status
    if (req.body.progress !== undefined) remediation.progress = req.body.progress
    if (req.body.afterCode) remediation.afterCode = req.body.afterCode
    if (req.body.mergeRequestIntegration) {
      remediation.mergeRequestIntegration = {
        ...(remediation.mergeRequestIntegration || {}),
        ...req.body.mergeRequestIntegration
      }
    }

    res.json({ remediation })
  }))

  app.post('/api/vulnerabilities/:id/remediation/merge-request', requireAuth, withLatency(async (req, res) => {
    const { platformUrl, branchName: requestedBranchName, platform, title, body } = req.body ?? {}
    const remediation = remediations[req.params.id]
    
    if (!remediation) {
      res.status(404).json({ error: 'Remediation not found' })
      return
    }

    // determine platform and construct a friendly URL (demo/stub)
    const platformKey = (platform || remediation.mergeRequestIntegration?.platform || 'github').toString().toLowerCase()
    let prUrl = platformUrl || ''
    const branchName = requestedBranchName || `fix-vulnerability-${req.params.id}-${Date.now()}`

    // GitHub App flow: if an installationId is provided (or stored in remediation config)
    const installationId = req.body.installationId || remediation.mergeRequestIntegration?.installationId
    const owner = req.body.owner || remediation.mergeRequestIntegration?.owner || GITHUB_OWNER
    const repo = req.body.repo || remediation.mergeRequestIntegration?.repo || GITHUB_REPO
    const baseBranch = req.body.baseBranch || remediation.mergeRequestIntegration?.baseBranch || GITHUB_BASE_BRANCH

    if (installationId && GITHUB_APP_ID && GITHUB_APP_PRIVATE_KEY) {
      try {
        const token = await getInstallationToken(installationId)

        // 1) get base branch SHA
        const baseRefRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`, {
          headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
        })

        if (!baseRefRes.ok) {
          const text = await baseRefRes.text()
          throw new Error(`Failed to fetch base branch ref: ${baseRefRes.status} ${text}`)
        }

        const baseRefData = await baseRefRes.json()
        const baseSha = baseRefData.object?.sha
        if (!baseSha) throw new Error('Could not determine base branch SHA')

        // 2) create branch (ref). If already exists, ignore the 422 error.
        const createRefRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
          method: 'POST',
          headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha })
        })

        if (!createRefRes.ok && createRefRes.status !== 422) {
          const text = await createRefRes.text()
          throw new Error(`Failed to create branch: ${createRefRes.status} ${text}`)
        }

        // 3) create the pull request
        const prTitle = title || `Remediation: ${req.params.id}`
        const prBody = body || `Automated remediation PR for vulnerability ${req.params.id}`

        const createPrRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
          method: 'POST',
          headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: prTitle, head: branchName, base: baseBranch, body: prBody })
        })

        if (!createPrRes.ok) {
          const text = await createPrRes.text()
          throw new Error(`Failed to create pull request: ${createPrRes.status} ${text}`)
        }

        const prData = await createPrRes.json()
        prUrl = prData.html_url || prData.url || prUrl

        const newPR = {
          id: `pr-${Date.now()}`,
          platform: 'github-app',
          url: prUrl,
          status: prData.state || 'open',
          createdDate: new Date(),
          meta: prData
        }

        remediation.pullRequests = remediation.pullRequests || []
        remediation.pullRequests.push(newPR)
        remediation.status = 'in-progress'

        res.status(201).json({ pullRequest: newPR })
        return
      } catch (err) {
        console.error('GitHub App PR creation failed:', err)
        // fall through to other flows/fallback
      }
    }

    // Attempt real GitHub PR creation when configured
    if (platformKey === 'github' && GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO) {
      try {
        const baseBranch = GITHUB_BASE_BRANCH

        // 1) get base branch SHA
        const baseRefRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${baseBranch}`, {
          headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
        })

        if (!baseRefRes.ok) {
          const text = await baseRefRes.text()
          throw new Error(`Failed to fetch base branch ref: ${baseRefRes.status} ${text}`)
        }

        const baseRefData = await baseRefRes.json()
        const baseSha = baseRefData.object?.sha
        if (!baseSha) throw new Error('Could not determine base branch SHA')

        // 2) create branch (ref). If already exists, ignore the 422 error.
        const createRefRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs`, {
          method: 'POST',
          headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha })
        })

        if (!createRefRes.ok && createRefRes.status !== 422) {
          const text = await createRefRes.text()
          throw new Error(`Failed to create branch: ${createRefRes.status} ${text}`)
        }

        // 3) create the pull request
        const prTitle = title || `Remediation: ${req.params.id}`
        const prBody = body || `Automated remediation PR for vulnerability ${req.params.id}`

        const createPrRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`, {
          method: 'POST',
          headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: prTitle, head: branchName, base: baseBranch, body: prBody })
        })

        if (!createPrRes.ok) {
          const text = await createPrRes.text()
          throw new Error(`Failed to create pull request: ${createPrRes.status} ${text}`)
        }

        const prData = await createPrRes.json()
        prUrl = prData.html_url || prData.url || prUrl

        const newPR = {
          id: `pr-${Date.now()}`,
          platform: 'github',
          url: prUrl,
          status: prData.state || 'open',
          createdDate: new Date(),
          meta: prData
        }

        remediation.pullRequests = remediation.pullRequests || []
        remediation.pullRequests.push(newPR)
        remediation.status = 'in-progress'

        res.status(201).json({ pullRequest: newPR })
        return
      } catch (err) {
        console.error('GitHub PR creation failed:', err)
        // fall through to demo URL fallback below
      }
    }

    // Fallback demo/stub URL if GitHub creation not configured or failed
    if (!prUrl) {
      if (platformKey === 'gitlab') {
        prUrl = `https://gitlab.com/example/repo/-/merge_requests/new?merge_request[source_branch]=${encodeURIComponent(branchName)}`
      } else if (platformKey === 'bitbucket') {
        prUrl = `https://bitbucket.org/example/repo/pull-requests/new?source=${encodeURIComponent(branchName)}`
      } else {
        prUrl = `https://github.com/example/repo/pull/new/${encodeURIComponent(branchName)}`
      }
    }

    const newPR = {
      id: `pr-${Date.now()}`,
      platform: platformKey,
      url: prUrl,
      status: 'open',
      createdDate: new Date()
    }

    remediation.pullRequests = remediation.pullRequests || []
    remediation.pullRequests.push(newPR)
    remediation.status = 'in-progress'

    res.status(201).json({ pullRequest: newPR })
  }))

  app.use((error, req, res, next) => {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}

const app = createApp()
const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]

if (isDirectExecution) {
  app.listen(port, () => {
    console.log(`SmallCompany API running on http://localhost:${port}`)
  })
}

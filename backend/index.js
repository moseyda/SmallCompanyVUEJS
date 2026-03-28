import express from 'express'
import { fileURLToPath } from 'node:url'
import { defaultSettings, workspaceData } from './data.js'

const port = 8787
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
    try {
      handler(req, res, next)
    } catch (error) {
      next(error)
    }
  }, 120)
}

export function createApp() {
  const app = express()
  let workspaceSettings = { ...defaultSettings }
  let currentSessionUser = null

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

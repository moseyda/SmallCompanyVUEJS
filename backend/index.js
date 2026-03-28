import express from 'express'
import { fileURLToPath } from 'node:url'
import { defaultSettings, workspaceData } from './data.js'

const port = 8787
const demoCredentials = {
  email: 'lead@smallcompany.io',
  password: 'Passw0rd!'
}
const demoUser = {
  id: 'user_project_lead',
  name: 'Project Lead',
  email: demoCredentials.email,
  role: 'admin'
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

    next()
  }

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

  app.get('/api/offices', withLatency((req, res) => {
    res.json({ offices: workspaceData.offices })
  }))

  app.get('/api/auth/session', withLatency((req, res) => {
    res.json({ user: currentSessionUser })
  }))

  app.post('/api/auth/login', withLatency((req, res) => {
    const { email, password } = req.body ?? {}

    if (email !== demoCredentials.email || password !== demoCredentials.password) {
      res.status(401).json({ error: 'Invalid sign-in credentials.' })
      return
    }

    currentSessionUser = { ...demoUser }
    res.status(200).json({ user: currentSessionUser })
  }))

  app.post('/api/auth/logout', withLatency((req, res) => {
    currentSessionUser = null
    res.status(200).json({ status: 'signed_out' })
  }))

  app.get('/api/settings', requireAuth, withLatency((req, res) => {
    res.json({ settings: workspaceSettings })
  }))

  app.put('/api/settings', requireAuth, withLatency((req, res) => {
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

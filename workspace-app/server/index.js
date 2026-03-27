import express from 'express'
import { defaultSettings, workspaceData } from './data.js'

const app = express()
const port = 8787

app.use(express.json())

let workspaceSettings = { ...defaultSettings }

const withLatency = (handler) => (req, res, next) => {
  setTimeout(() => {
    try {
      handler(req, res, next)
    } catch (error) {
      next(error)
    }
  }, 120)
}

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

app.get('/api/settings', withLatency((req, res) => {
  res.json({ settings: workspaceSettings })
}))

app.put('/api/settings', withLatency((req, res) => {
  workspaceSettings = {
    ...workspaceSettings,
    ...req.body
  }

  res.json({ settings: workspaceSettings })
}))

app.post('/api/inquiries', withLatency((req, res) => {
  const { name, email, scope, message } = req.body ?? {}

  if (!name || !email || !scope || !message) {
    res.status(400).json({ error: 'Missing required inquiry fields.' })
    return
  }

  res.status(201).json({ status: 'received' })
}))

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`SmallCompany API running on http://localhost:${port}`)
})

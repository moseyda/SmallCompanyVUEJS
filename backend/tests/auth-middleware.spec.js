import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../index.js'

describe('settings auth middleware', () => {
  it('rejects unauthorised settings reads', async () => {
    const app = createApp()

    const response = await request(app).get('/api/settings')

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Sign-in required.' })
  })

  it('allows authorised settings reads after sign-in', async () => {
    const app = createApp()

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'viewer@smallcompany.io', password: 'Passw0rd!' })

    expect(loginResponse.status).toBe(200)

    const response = await request(app).get('/api/settings')

    expect(response.status).toBe(200)
    expect(response.body.settings).toBeTruthy()
  })

  it('rejects settings updates for users without write permission', async () => {
    const app = createApp()

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'viewer@smallcompany.io', password: 'Passw0rd!' })

    const response = await request(app)
      .put('/api/settings')
      .send({ name: 'Viewer Name' })

    expect(response.status).toBe(403)
    expect(response.body).toEqual({ error: 'Insufficient permissions.' })
  })

  it('allows settings updates for editor role', async () => {
    const app = createApp()

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'editor@smallcompany.io', password: 'Passw0rd!' })

    const response = await request(app)
      .put('/api/settings')
      .send({ name: 'Editor Name' })

    expect(response.status).toBe(200)
    expect(response.body.settings.name).toBe('Editor Name')
  })

  it('revokes settings access after sign-out', async () => {
    const app = createApp()

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'lead@smallcompany.io', password: 'Passw0rd!' })

    const logoutResponse = await request(app).post('/api/auth/logout')
    expect(logoutResponse.status).toBe(200)

    const response = await request(app).get('/api/settings')

    expect(response.status).toBe(401)
  })
})

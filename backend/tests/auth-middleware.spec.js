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
      .send({ email: 'lead@smallcompany.io', password: 'Passw0rd!' })

    expect(loginResponse.status).toBe(200)

    const response = await request(app).get('/api/settings')

    expect(response.status).toBe(200)
    expect(response.body.settings).toBeTruthy()
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

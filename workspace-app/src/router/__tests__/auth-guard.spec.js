import { createMemoryHistory, createRouter } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { routes, installAuthGuard } from '../index'
import { useAuthStore } from '../../stores/auth'

describe('auth route guard', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('redirects unauthenticated users from settings to login', async () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createMemoryHistory(),
      routes
    })

    installAuthGuard(router, pinia)

    await router.push('/settings')

    expect(router.currentRoute.value.path).toBe('/login')
    expect(router.currentRoute.value.query.redirect).toBe('/settings')
  })

  it('allows authenticated users to access settings', async () => {
    const pinia = createPinia()
    const authStore = useAuthStore(pinia)
    authStore.setUser({
      id: 'user_project_lead',
      name: 'Project Lead',
      email: 'lead@smallcompany.io',
      role: 'admin',
      permissions: ['settings:read', 'settings:write']
    })

    const router = createRouter({
      history: createMemoryHistory(),
      routes
    })

    installAuthGuard(router, pinia)

    await router.push('/settings')

    expect(router.currentRoute.value.path).toBe('/settings')
  })
})

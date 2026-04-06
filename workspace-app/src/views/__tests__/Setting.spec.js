import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Setting from '../Setting.vue'
import { useAuthStore } from '../../stores/auth'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Setting view', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads and saves settings through the API', async () => {
    const authStore = useAuthStore()
    authStore.setUser({
      id: 'user_project_lead',
      name: 'Project Lead',
      email: 'lead@vulnlaunch.io',
      role: 'admin',
      permissions: ['settings:read', 'settings:write']
    })

    const fetchSpy = vi.spyOn(global, 'fetch')

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        settings: {
          name: 'Casey Rivera',
          email: 'casey@example.com',
          cadence: 'Weekly',
          notifyEmail: true,
          notifyPush: true,
          shareSummary: false
        }
      })
    })

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        settings: {
          name: 'Casey Updated',
          email: 'casey@example.com',
          cadence: 'Weekly',
          notifyEmail: true,
          notifyPush: true,
          shareSummary: false
        }
      })
    })

    const wrapper = mount(Setting)

    await flushPromises()
    await flushPromises()

    const nameInput = wrapper.get('[data-test="display-name"]')
    await nameInput.setValue('Casey Updated')
    await wrapper.get('button.btn-primary').trigger('click')

    await flushPromises()
    await flushPromises()

    expect(fetchSpy).toHaveBeenNthCalledWith(1, '/api/settings', expect.any(Object))
    expect(fetchSpy).toHaveBeenNthCalledWith(
      2,
      '/api/settings',
      expect.objectContaining({ method: 'PUT' })
    )
    expect(wrapper.text()).toContain('Settings synced with API.')
  })
})

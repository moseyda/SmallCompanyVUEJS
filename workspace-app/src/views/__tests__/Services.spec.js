import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Services from '../Services.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Services view', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders service models from the API', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        services: [
          {
            name: 'Modernisation Architecture',
            description: 'Legacy migration plans.',
            bullets: ['Service decomposition']
          }
        ]
      })
    })

    const wrapper = mount(Services, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    await flushPromises()
    await flushPromises()

    expect(wrapper.text()).toContain('Service Models')
    expect(wrapper.text()).toContain('Modernisation Architecture')
    expect(global.fetch).toHaveBeenCalledWith('/api/services', expect.any(Object))
  })
})

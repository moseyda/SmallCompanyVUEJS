import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Team from '../Team.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Team view', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders fetched team members without ref/filter runtime errors', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        teamMembers: [
          {
            name: 'Mina Alvarez',
            role: 'Product Director',
            focus: 'Strategy',
            bio: 'Shapes roadmap bets.'
          },
          {
            name: 'Theo Morgan',
            role: 'Lead Frontend Engineer',
            focus: 'Engineering',
            bio: 'Builds resilient Vue systems.'
          }
        ]
      })
    })

    const wrapper = mount(Team)

    await flushPromises()
    await flushPromises()

    expect(wrapper.text()).toContain('The Team Behind the Scale-Up')
    expect(wrapper.text()).toContain('Mina Alvarez')
    expect(wrapper.text()).toContain('Theo Morgan')
  })
})

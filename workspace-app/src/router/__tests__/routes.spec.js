import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import { routes } from '../index'

describe('route smoke tests', () => {
  const smokePaths = ['/', '/work', '/services', '/insights', '/about', '/team', '/contact', '/settings', '/login']

  it.each(smokePaths)('resolves route %s', async (path) => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes
    })

    await router.push(path)
    expect(router.currentRoute.value.path).toBe(path)
  })
})

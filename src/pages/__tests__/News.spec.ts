import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import News from '../News.vue'

describe('News.vue', () => {
  it('renders the cute empty state when there are no news items', () => {
    const wrapper = mount(News, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              news: {
                items: [],
                isLoading: false,
                error: null,
              },
            },
          }),
        ],
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          Footer: true,
        },
      },
    })

    const emptyState = wrapper.find('.empty-state')
    expect(emptyState.exists()).toBe(true)
    expect(wrapper.text()).toContain('Paws & Relax — No News Just Yet')
    expect(wrapper.text()).toContain('Our rescue crew is currently busy')
    expect(wrapper.text()).toContain('Meet Adoptable Pets')
    expect(wrapper.text()).toContain('Follow on Instagram')
    expect(wrapper.findComponent({ name: 'Footer' }).exists()).toBe(true)
  })

  it('renders news articles when news items exist', () => {
    const wrapper = mount(News, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              news: {
                items: [
                  {
                    id: 'news-1',
                    title: 'Adoption Fair Announcement',
                    excerpt: 'Join us this weekend!',
                    body: 'Details about the event.',
                    category: 'events',
                    publishedAt: '2026-10-01',
                  },
                ],
                isLoading: false,
                error: null,
              },
            },
          }),
        ],
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          Footer: true,
        },
      },
    })

    expect(wrapper.find('.empty-state').exists()).toBe(false)
    expect(wrapper.text()).toContain('Adoption Fair Announcement')
    expect(wrapper.text()).toContain('Join us this weekend!')
    expect(wrapper.findComponent({ name: 'Footer' }).exists()).toBe(true)
  })
})

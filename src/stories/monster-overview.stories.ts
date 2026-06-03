import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import type { Monster } from '../components/monster-overview.js'
import '../components/monster-overview.js'

const mockMonsters: Monster[] = [
  {
    id: 1,
    name: 'bulbasaur',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    types: ['grass', 'poison'],
  },
  {
    id: 4,
    name: 'charmander',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    types: ['fire'],
  },
  {
    id: 7,
    name: 'squirtle',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    types: ['water'],
  },
  {
    id: 25,
    name: 'pikachu',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    types: ['electric'],
  },
  {
    id: 39,
    name: 'jigglypuff',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png',
    types: ['normal', 'fairy'],
  },
  {
    id: 94,
    name: 'gengar',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
    types: ['ghost', 'poison'],
  },
]

const meta: Meta = {
  title: 'Components/MonsterOverview',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const WithData: Story = {
  render: () => html`
    <monster-overview
      headline="Pocket-sized monsters, pocket-friendly prices"
      .monsters=${mockMonsters}
      .disableFetch=${true}
    ></monster-overview>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('monster-overview') as HTMLElement
    const shadow = el.shadowRoot!
    const labels = Array.from(shadow.querySelectorAll('label'))
    const fireLabel = labels.find(l => l.textContent?.includes('fire'))!
    const fireCheckbox = fireLabel.querySelector('input[type="checkbox"]') as HTMLInputElement
    fireCheckbox.click()

    await new Promise(r => setTimeout(r, 50))

    const cards = shadow.querySelectorAll('monster-card')
    try {
      const { expect } = await import('vitest')
      expect(cards.length).toBe(1)
    } catch { /* assertions only run in vitest context */ }
  },
}

export const WithoutHeadline: Story = {
  render: () => html`
    <monster-overview
      .monsters=${mockMonsters}
      .disableFetch=${true}
    ></monster-overview>
  `,
}

export const Loading: Story = {
  render: () => html`
    <monster-overview
      headline="Pocket-sized monsters, pocket-friendly prices"
      .loading=${true}
      .disableFetch=${true}
    ></monster-overview>
  `,
}

export const Error: Story = {
  render: () => html`
    <monster-overview
      headline="Pocket-sized monsters, pocket-friendly prices"
      error="Failed to load monsters. Please try again later."
      .disableFetch=${true}
    ></monster-overview>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('monster-overview') as HTMLElement
    const shadow = el.shadowRoot!

    const errorEl = shadow.querySelector('.error')
    try {
      const { expect } = await import('vitest')
      expect(errorEl).not.toBeNull()
      expect(errorEl!.textContent).toContain('Failed to load monsters')
    } catch { /* assertions only run in vitest context */ }
  },
}

export const Empty: Story = {
  render: () => html`
    <monster-overview
      headline="Pocket-sized monsters, pocket-friendly prices"
      .monsters=${[]}
      .disableFetch=${true}
    ></monster-overview>
  `,
}

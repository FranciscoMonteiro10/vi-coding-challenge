import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../components/monster-card.js'

interface MonsterCardArgs {
  monsterId: number
  name: string
  image: string
  types: string[]
  href: string
}

const meta: Meta<MonsterCardArgs> = {
  title: 'Components/MonsterCard',
  tags: ['autodocs'],
  render: args => html`
    <monster-card
      .monsterId=${args.monsterId}
      .name=${args.name}
      .image=${args.image}
      .types=${args.types}
      .href=${args.href}
    ></monster-card>
  `,
  argTypes: {
    monsterId: { control: 'number' },
    name: { control: 'text' },
    image: { control: 'text' },
    types: { control: 'object' },
    href: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<MonsterCardArgs>

export const Default: Story = {
  args: {
    monsterId: 1,
    name: 'bulbasaur',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    types: ['grass', 'poison'],
    href: '#',
  },
}

export const SingleType: Story = {
  args: {
    monsterId: 4,
    name: 'charmander',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    types: ['fire'],
    href: '#',
  },
}

export const MultipleTypes: Story = {
  args: {
    monsterId: 6,
    name: 'charizard',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    types: ['fire', 'flying'],
    href: '#',
  },
}
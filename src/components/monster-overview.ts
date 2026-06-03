import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import './monster-card.js'
import { TYPE_COLORS } from "../constants.js";

export interface Monster {
  id: number
  name: string
  image: string
  types: string[]
}

interface PokemonApiResult {
  url: string
}

interface PokemonApiResponse {
  results: PokemonApiResult[]
}

interface PokemonDetail {
  id: number
  name: string
  sprites: { front_default: string }
  types: { type: { name: string } }[]
}

@customElement('monster-overview')
export class MonsterOverview extends LitElement {
  @property() headline = ''
  @property({ type: Array }) monsters: Monster[] = []
  @property({ type: Boolean }) loading = false
  @property() error = ''
  @property({ type: Boolean }) disableFetch = false

  @state() private selectedTypes = new Set<string>()
  @state() private filterOpen = true

  private get allTypes(): string[] {
    const types = new Set<string>()
    this.monsters.forEach(m => m.types.forEach(t => types.add(t)))
    return Array.from(types).sort()
  }

  private get filteredMonsters(): Monster[] {
    if (this.selectedTypes.size === 0) return this.monsters
    return this.monsters.filter(m => m.types.some(t => this.selectedTypes.has(t)))
  }

  async connectedCallback() {
    super.connectedCallback()
    if (!this.disableFetch && this.monsters.length === 0 && !this.error) {
      this.loading = true
      await this.fetchMonsters()
    }
  }

  private async fetchMonsters() {
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data: PokemonApiResponse = await res.json()

      const details = await Promise.all(
        data.results.map(({ url }) => fetch(url).then(r => {
          if (!r.ok) throw new Error(`Failed to fetch ${url}`)
          return r.json() as Promise<PokemonDetail>
        }))
      )

      this.monsters = details.map(d => ({
        id: d.id,
        name: d.name,
        image: d.sprites.front_default,
        types: d.types.map(t => t.type.name),
      }))
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Something went wrong'
    } finally {
      this.loading = false
    }
  }

  private toggleType(type: string) {
    const next = new Set(this.selectedTypes)
    next.has(type) ? next.delete(type) : next.add(type)
    this.selectedTypes = next
  }

  render() {
    return html`
      ${this.headline ? html`<h1>${this.headline}</h1>` : ''}

      <div class="layout">
        <aside class="filter">
          <button class="filter-toggle" @click=${() => (this.filterOpen = !this.filterOpen)}>
    Filter
          <span class="arrow" aria-hidden="true">${this.filterOpen ? '▲' : '▼'}</span>
          </button>
    ${this.filterOpen ? html`
      <h2>Type</h2>
      <ul>
        ${this.allTypes.map(
          type => html`
            <li>
              <label>
                <input
                  type="checkbox"
                  .checked=${this.selectedTypes.has(type)}
                  @change=${() => this.toggleType(type)}
                />
                ${type}
                <span class="dot" style="background-color: ${TYPE_COLORS[type] ?? '#ccc'}"></span>
              </label>
            </li>
          `
    )}
    </ul>
  ` : ''}
</aside>

        <div class="grid">
          ${this.loading
      ? html`<p>Loading...</p>`
      : this.error
        ? html`<p class="error">${this.error}</p>`
        : this.filteredMonsters.length === 0
          ? html`<p>No monsters found.</p>`
          : this.filteredMonsters.map(
              m => html`
                <monster-card
                  .monsterId=${m.id}
                  .name=${m.name}
                  .image=${m.image}
                  .types=${m.types}
                  href="/monster/${m.id}"
                ></monster-card>
              `
            )}
        </div>
      </div>
    `
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      font-family: system-ui, sans-serif;
      padding: 24px;
      width: 100%;
      box-sizing: border-box;
      max-width: 1100px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 24px;
    }

    .layout {
      display: flex;
      gap: 24px;
      flex: 1;
      overflow: hidden;
      min-height: 0;
    }

    aside.filter {
      width: 200px;
      flex-shrink: 0;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 16px;
      overflow-y: auto;
      align-self: flex-start;
      max-height: 100%;
      background: #fff;
      color: #333;
    }

    @media (prefers-color-scheme: dark) {
      aside.filter {
        background: #1e1f28;
        color: #e0e0e0;
        border-color: #3a3b47;
      }
    }

    .filter .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-left: 4px;
    }

    .filter-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background: none;
      border: none;
      padding: 0 0 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      color: inherit;
    }

    .arrow {
      font-size: 12px;
    }

    h2 {
      margin: 0 0 8px;
      font-size: 14px;
      color: #e7dada;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      text-transform: capitalize;
      cursor: pointer;
    }

    .error {
      color: #e53e3e;
      padding: 16px;
    }

    .grid {
      flex: 1;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      align-content: start;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'monster-overview': MonsterOverview
  }
}
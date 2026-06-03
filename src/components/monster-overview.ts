import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import './monster-card.js'
import { TYPE_COLORS } from "../constants.js";

interface Monster {
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

  @state() private monsters: Monster[] = []
  @state() private selectedTypes = new Set<string>()
  @state() private loading = true

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
    await this.fetchMonsters()
  }

  private async fetchMonsters() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    const data: PokemonApiResponse = await res.json()

    const details = await Promise.all(
      data.results.map(({ url }) => fetch(url).then(r => r.json() as Promise<PokemonDetail>))
    )

    this.monsters = details.map(d => ({
      id: d.id,
      name: d.name,
      image: d.sprites.front_default,
      types: d.types.map(t => t.type.name),
    }))
    this.loading = false
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
          <h2>Filter</h2>
          <h3>Type</h3>
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
        </aside>

        <div class="grid">
          ${this.loading
      ? html`<p>Loading...</p>`
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
    }

    .filter .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-left: 4px;
    }

    h2 {
      margin: 0 0 12px;
      font-size: 16px;
    }

    h3 {
      margin: 0 0 8px;
      font-size: 14px;
      color: #666;
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
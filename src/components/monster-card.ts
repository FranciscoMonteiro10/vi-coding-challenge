import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TYPE_COLORS } from "../constants.js";

@customElement('monster-card')
export class MonsterCard extends LitElement {
  @property({ type: Number }) monsterId = 0
  @property() name = ''
  @property() image = ''
  @property({ type: Array }) types: string[] = []
  @property() href = ''

  render() {
    return html`
      <a href=${this.href || '#'}>
        <div class="card">
          <span class="number">#${this.monsterId}</span>
          <img src=${this.image} alt=${this.name} />
          <div class="footer">
            <span class="name">${this.name}</span>
            <div class="types">
              ${this.types.map(
                type => html`
                  <span
                    class="dot"
                    style="background-color: ${TYPE_COLORS[type] ?? '#ccc'}"
                  ></span>
                `
    )}
            </div>
          </div>
        </div>
      </a>
    `
  }

  static styles = css`
    :host {
      display: block;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    .card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 8px;
      position: relative;
      background: #fff;
    }

    .number {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 12px;
      color: #999;
    }

    img {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      object-fit: contain;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }

    .name {
      font-size: 14px;
      font-weight: 500;
      text-transform: capitalize;
      color: #222;
    }

    .types {
      display: flex;
      gap: 4px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'monster-card': MonsterCard
  }
}
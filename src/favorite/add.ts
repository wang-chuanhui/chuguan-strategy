import { CSSResultGroup, LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { HomeAssistant } from '../types/homeassistant/types'
import './dialog'
import { localize } from '../utilities/localize'

@customElement('chuguan_add-favorite')
export class FavoriteAdd extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant
  @state() private name: string = ''


  private _config: any

  setConfig(config: any) {
    this._config = config
  }

  addFavorite() {
    if (this.name == '') {
      return
    }
    this.dispatchEvent(new CustomEvent('cg_add_favorites', {
      detail: { name: this.name },
      bubbles: true,
      composed: true
    }))
    this.name = ''
  }

  handleInput(e: any) {
    this.name = e.target.value
  }

  render() {
    return html`
      <ha-card>
        <div class="header">
        <div class="text-field-container">
          <ha-textfield class="text-field" label="添加收藏夹" placeholder="请输入收藏夹名称" .value=${this.name} @input=${this.handleInput}></ha-textfield>
        </div>
        <mwc-button slot="primaryAction" @click=${this.addFavorite} dialogInitialFocus>
          ${localize('favorite.save')}
        </mwc-button>
        </div>
      </ha-card>
    `
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }
      .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 12px;
        background-color: var(--card-background-color);
        border-radius: 12px;
      }
        .text-field-container {
          flex: 1;
        }
          .text-field {
            width: 100%;
          }
    `
  }
}

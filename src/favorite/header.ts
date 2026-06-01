import { CSSResultGroup, LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { HomeAssistant } from '../types/homeassistant/types'
import './dialog'

@customElement('chuguan-favorite-header')
export class FavoriteHeader extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant
  @property() public title: string = '收藏实体'

  private _config: any

  setConfig(config: any) {
    this._config = config
    if (config.title) {
      this.title = config.title
    }
  }

  private _openDialog() {
    const dialog = this.shadowRoot?.querySelector('chuguan-favorite-dialog') as any
    if (dialog) {
      dialog.open = true
    }
  }

  render() {
    return html`
      <chuguan-favorite-dialog
        .hass=${this.hass}
        .open=${false}
      ></chuguan-favorite-dialog>
      
      <div class="header">
        <div class="title-section">
          <span class="title">${this.title}</span>
        </div>
        <ha-icon-button
          class="action-button"
          @click=${this._openDialog}
        >
          <ha-icon icon="mdi:star-plus"></ha-icon>
        </ha-icon-button>
      </div>
    `
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }
      
      .header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 0;
      }
      
      .title-section {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .title {
        font-size: 18px;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      
      .action-button {
        color: var(--primary-text-color);
        --mdc-icon-button-size: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .action-button:hover {
        color: var(--primary-color);
      }
        ha-icon {
        display: flex;
        }
    `
  }
}

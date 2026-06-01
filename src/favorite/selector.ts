import { CSSResultGroup, LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { HomeAssistant } from '../types/homeassistant/types'
import './dialog'

@customElement('chuguan-favorite-selector')
export class FavoriteSelector extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant

  private _config: any

  public setConfig(config: any) {
    this._config = config
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
      
      <mushroom-template-card
        primary="管理收藏"
        icon="mdi:star-plus"
        @click=${this._openDialog}
      >
      </mushroom-template-card>
    `
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: inline-block;
      }
      
      mushroom-template-card {
        cursor: pointer;
      }
    `
  }
}

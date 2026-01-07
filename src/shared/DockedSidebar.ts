import { CSSResultGroup, LitElement, css, html, TemplateResult, PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { HomeAssistant } from '../types/homeassistant/types';
import { localize } from '../utilities/localize';

@customElement('chuguan-docked-sidebar')
export class DockedSidebar extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  private _handleClick() {
    const event = 'hass-dock-sidebar'
    let dock = 'always_hidden'
    if (this.hass.dockedSidebar == 'always_hidden') {
      dock = 'docked'
    }
    this.dispatchEvent(new CustomEvent(event, {
      detail: {
        dock
      }, bubbles: true, composed: true
    }))
  }

  setConfig(config: {}) {

  }

  connectedCallback(): void {
    super.connectedCallback()
    this.queryCard()
  }

  queryCard(): void {
    const isHidden = this.hass.dockedSidebar == 'always_hidden'
    const element: any = this.renderRoot.querySelector('#docked-sidebar')
    if (element) {
      if (element.setConfig) {
        element.setConfig({
          primary: isHidden ? localize('event.show_sidebar') : localize('event.hide_sidebar'), 
          icon: 'mdi:page-layout-sidebar-left', 
          icon_color: 'blue', 
          tap_action: {
            action: 'none'
          }, 
          hold_action: {
            action: 'none'
          }
        })
      }
      element.hass = this.hass
    }else {
      setTimeout(() => {
        this.queryCard()
      }, 10);
    }
  }

  render() {
    return html`
        <mushroom-template-card id="docked-sidebar" @click="${this._handleClick}">
      </mushroom-template-card>
    `;
  }

  
}

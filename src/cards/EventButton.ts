import { CSSResultGroup, LitElement, css, html, TemplateResult } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('chuguan-event-button')
export class EventButton extends LitElement {

    config: { title: string, event: string } = {
        title: '',
        event: ''
    };
    private _handleClick() {
        const event = this.config.event ?? "";
        if (event) {
            this.dispatchEvent(new CustomEvent(event, { bubbles: true, composed: true }));
        }
    }

    setConfig(config: { title: string, event: string }) {
        this.config = config;
    }


    render() {
        return html`
      <ha-card class="my-button">
        <div>
          <mushroom-button @click=${this._handleClick}>
            <span style="line-height: 1;padding: 16px;">${this.config.title}</span>
          </mushroom-button>
        </div>
      </ha-card>
    `;
    }

    static get styles(): CSSResultGroup {
        return css`
      .my-button {

      }
        .my-button:active {
          opacity: 0.5;
        }
    `;
    }
}

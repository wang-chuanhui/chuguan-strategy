import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ClockCardConfig } from "../types/homeassistant/panels/lovelace/cards/types";
import { HomeAssistant } from "../types/homeassistant/types";
import { LovelaceGridOptions } from "../types/homeassistant/panels/lovelace/types";

@customElement("chuguan-clock-card")
export class ChuguanClockCard extends LitElement {

  public static getStubConfig(): ClockCardConfig {
    return {
      type: "custom:chuguan-clock-card",
    };
  }

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: ClockCardConfig;

  public setConfig(config: ClockCardConfig): void {
    this._config = config;
    // Dynamically import the clock type based on the configuration
    if (config.clock_style === "analog") {
      import("./chuguan-clock-card-analog");
    } else {
      import("./chuguan-clock-card-digital");
    }
  }

  public getCardSize(): number {
    if (this._config?.clock_size === "small") return 1;
    return 2;
  }

  public getGridOptions(): LovelaceGridOptions {
    switch (this._config?.clock_style) {
      case "analog":
        switch (this._config?.clock_size) {
          case "medium":
            return {
              min_rows: this._config?.title ? 4 : 3,
              rows: 3,
              min_columns: 5,
              columns: 6,
            };
          case "large":
            return {
              min_rows: this._config?.title ? 5 : 4,
              rows: 4,
              min_columns: 6,
              columns: 6,
            };
          default:
            return {
              min_rows: this._config?.title ? 3 : 2,
              rows: 2,
              min_columns: 2,
              columns: 6,
            };
        }
      default:
        switch (this._config?.clock_size) {
          case "medium":
            return {
              min_rows: this._config?.title ? 2 : 1,
              rows: 2,
              max_rows: 4,
              min_columns: 4,
              columns: 6,
            };
          case "large":
            return {
              min_rows: 2,
              rows: 2,
              max_rows: 4,
              min_columns: 6,
              columns: 6,
            };
          default:
            return {
              min_rows: 1,
              rows: 1,
              max_rows: 4,
              min_columns: 3,
              columns: 6,
            };
        }
    }
  }

  protected render() {
    if (!this._config) return nothing;

    return html`
      <ha-card
        class=${classMap({
          "no-background": this._config.no_background ?? false,
        })}
      >
        <div
          class="time-wrapper ${this._config.clock_size
            ? `size-${this._config.clock_size}`
            : ""}"
        >
          ${this._config.title !== undefined
            ? html`<div class="time-title">${this._config.title}</div>`
            : nothing}
          ${this._config.clock_style === "analog"
            ? html`
                <chuguan-clock-card-analog
                  .hass=${this.hass}
                  .config=${this._config}
                ></chuguan-clock-card-analog>
              `
            : html`
                <chuguan-clock-card-digital
                  .hass=${this.hass}
                  .config=${this._config}
                ></chuguan-clock-card-digital>
              `}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      height: 100%;
    }

    .no-background {
      background: none;
      box-shadow: none;
      border: none;
    }

    .time-wrapper {
      display: flex;
      height: calc(100% - 12px);
      align-items: center;
      flex-direction: column;
      justify-content: center;
      padding: 6px 8px;
      row-gap: 6px;
    }

    .time-wrapper.size-medium,
    .time-wrapper.size-large {
      height: calc(100% - 32px);
      padding: 16px;
      row-gap: 12px;
    }

    .time-title {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.2;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    .time-wrapper.size-medium .time-title {
      font-size: 16px;
      line-height: 1.2;
    }

    .time-wrapper.size-large .time-title {
      font-size: 24px;
      line-height: 1.2;
    }
  `;
}


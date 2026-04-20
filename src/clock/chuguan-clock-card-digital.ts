import { css, html, LitElement, nothing } from "lit";
import type { PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "../types/homeassistant/types";
import { ClockCardConfig, resolveTimeZone, useAmPm } from "../types/homeassistant/panels/lovelace/cards/types";


const INTERVAL = 1000;

@customElement("chuguan-clock-card-digital")
export class ChuguanClockCardDigital extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public config?: ClockCardConfig;

  @state() private _dateTimeFormat?: Intl.DateTimeFormat;
  @state() private _dateTimeFormatDate?: Intl.DateTimeFormat;

  @state() private _timeHour?: string;

  @state() private _timeMinute?: string;

  @state() private _timeSecond?: string;

  @state() private _timeAmPm?: string;

  @state() private _dateString?: string;

  @state() private _weekdayString?: string;

  private _tickInterval?: undefined | number;

  private _initDate() {
    if (!this.config || !this.hass) {
      return;
    }

    let locale = this.hass?.locale;

    if (this.config?.time_format) {
      locale = { ...locale, time_format: this.config.time_format };
    }

    const h12 = useAmPm(locale);
    this._dateTimeFormat = new Intl.DateTimeFormat(this.hass.locale.language, {
      hour: h12 ? "numeric" : "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: h12 ? "h12" : "h23",
      timeZone:
        this.config?.time_zone ||
        resolveTimeZone(locale.time_zone, this.hass.config?.time_zone),
    });
    // 日期格式化
    this._dateTimeFormatDate = new Intl.DateTimeFormat(this.hass.locale.language, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
      timeZone:
        this.config?.time_zone ||
        resolveTimeZone(locale.time_zone, this.hass.config?.time_zone),
    });

    this._tick();
  }

  protected updated(changedProps: PropertyValues) {
    if (changedProps.has("hass")) {
      const oldHass = changedProps.get("hass");
      if (!oldHass || oldHass.locale !== this.hass?.locale) {
        this._initDate();
      }
    }
  }

  public connectedCallback() {
    super.connectedCallback();
    this._startTick();
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this._stopTick();
  }

  private _startTick() {
    this._tickInterval = window.setInterval(() => this._tick(), INTERVAL);
    this._tick();
  }

  private _stopTick() {
    if (this._tickInterval) {
      clearInterval(this._tickInterval);
      this._tickInterval = undefined;
    }
  }

  private _tick() {
    if (!this._dateTimeFormat) return;

    const parts = this._dateTimeFormat.formatToParts();

    this._timeHour = parts.find((part) => part.type === "hour")?.value;
    this._timeMinute = parts.find((part) => part.type === "minute")?.value;
    this._timeSecond = this.config?.show_seconds
      ? parts.find((part) => part.type === "second")?.value
      : undefined;
    this._timeAmPm = parts.find((part) => part.type === "dayPeriod")?.value;
    if (this._dateTimeFormatDate) {
      // 格式化日期
      const dateParts = this._dateTimeFormatDate.formatToParts();
      const year = dateParts.find((part) => part.type === "year")?.value;
      const month = dateParts.find((part) => part.type === "month")?.value;
      const day = dateParts.find((part) => part.type === "day")?.value;
      const weekday = dateParts.find((part) => part.type === "weekday")?.value;

      this._dateString = `${year}-${month}-${day}`;
      this._weekdayString = weekday;
    }

  }

  render() {
    if (!this.config) return nothing;

    const sizeClass = this.config.clock_size
      ? `size-${this.config.clock_size}`
      : "";

    return html`
      <div class="time-parts ${sizeClass}">
        ${this.config?.show_date ? html`
          <div class="date-section">
            <div class="weekday">${this._weekdayString}</div>
            <div class="date">${this._dateString}</div>
          </div>
      ` : nothing}
        <div class="time-section">
          <div class="time-part hour">${this._timeHour}</div>
            <div class="time-part minute">${this._timeMinute}</div>
            ${this._timeSecond !== undefined
            ? html`<div class="time-part second">${this._timeSecond}</div>`
            : nothing}
            ${this._timeAmPm !== undefined
            ? html`<div class="time-part am-pm">${this._timeAmPm}</div>`
            : nothing}
        </div>
        
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .time-parts {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 10px;

      font-size: 1.5rem;
      font-weight: 500;
      line-height: 0.8;
      direction: ltr;
    }

    .time-title + .time-parts {
      font-size: 1.5rem;
    }

    .time-parts.size-medium {
      font-size: 3rem;
      gap: 15px;
    }

    .time-parts.size-large {
      font-size: 4rem;
      gap: 20px;
    }

    .time-parts.size-medium .time-part.second,
    .time-parts.size-medium .time-part.am-pm {
      font-size: 16px;
      margin-left: 6px;
    }

    .time-parts.size-large .time-part.second,
    .time-parts.size-large .time-part.am-pm {
      font-size: 24px;
      margin-left: 8px;
    }

    .time-parts .time-part.hour {
      grid-area: hour;
    }

    .time-parts .time-part.minute {
      grid-area: minute;
    }

    .time-parts .time-part.second {
      grid-area: second;
      line-height: 0.9;
      opacity: 0.4;
    }

    .time-parts .time-part.am-pm {
      grid-area: am-pm;
      line-height: 0.9;
      opacity: 0.6;
    }

    .time-parts .time-part.second,
    .time-parts .time-part.am-pm {
      font-size: 10px;
      margin-left: 4px;
    }

    .time-parts .time-part.hour:after {
      content: ":";
      margin: 0 2px;
    }

    /* 左侧日期区域 */
    .date-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;

      font-size: 1rem;
      line-height: 1;
    }

    .time-parts.size-small .date-section {
      font-size: 0.8rem;
    }

    .time-parts.size-medium .date-section {
      font-size: 1.1rem;
    }
    .time-parts.size-large .date-section {
      font-size: 1.4rem;
    }



      /* 右侧时间区域 */
    .time-section {
      align-items: center;
      display: grid;
      grid-template-areas:
        "hour minute second"
        "hour minute am-pm";

    }
  `;
}


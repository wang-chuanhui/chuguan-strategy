import { ActionConfig } from '../../../data/lovelace/config/action';
import { LovelaceCardConfig } from '../../../data/lovelace/config/card';
import memoizeOne from "memoize-one";


/**
 * Home Assistant Area Card Config.
 *
 * @property {string} area - The area associated with the card.
 * @property {string} [navigation_path] - Optional navigation path for the card.
 * @property {boolean} [show_camera] - Whether to show the camera view.
 * @property {"live" | "auto"} [camera_view] - The camera view mode.
 * @property {string} [aspect_ratio] - The aspect ratio of the card.
 * @see https://www.home-assistant.io/dashboards/area/
 */
export interface AreaCardConfig extends LovelaceCardConfig {
  area: string;
  navigation_path?: string;
  show_camera?: boolean;
  camera_view?: 'live' | 'auto';
  aspect_ratio?: string;
}

/**
 * Home Assistant Picture Entity Config.
 *
 * @property {string} entity - An entity_id used for the picture.
 * @property {string} [name] - Overwrite entity name.
 * @property {string} [image] - URL of an image.
 * @property {string} [camera_image] - Camera entity_id to use.
 * @property {"live" | "auto"} [camera_view] - The camera view mode.
 * @property {Record<string, unknown>} [state_image] - Map entity states to images.
 * @property {string[]} [state_filter] - State-based CSS filters.
 * @property {string} [aspect_ratio] - Forces the height of the image to be a ratio of the width.
 * @property {ActionConfig} [tap_action] - Action taken on card tap.
 * @property {ActionConfig} [hold_action] - Action taken on card tap and hold.
 * @property {ActionConfig} [double_tap_action] - Action taken on card double tap.
 * @property {boolean} [show_name=true] - Shows name in footer.
 * @property {string} [theme=true] - Override the used theme for this card.
 * @property {boolean} [show_state] - Shows state in footer.
 * @see https://www.home-assistant.io/dashboards/picture-entity/
 */
export interface PictureEntityCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  image?: string;
  camera_image?: string;
  camera_view?: 'live' | 'auto';
  state_image?: Record<string, unknown>;
  state_filter?: string[];
  aspect_ratio?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  show_name?: boolean;
  show_state?: boolean;
  theme?: string;
}

/**
 * Home Assistant Stack Card Config.
 *
 * @property {string} type - The stack type.
 * @property {Object[]} cards - The content of the stack.
 * @see https://www.home-assistant.io/dashboards/horizontal-stack/
 * @see https://www.home-assistant.io/dashboards/vertical-stack/
 */
export interface StackCardConfig extends LovelaceCardConfig {
  type: string;
  cards: LovelaceCardConfig[];
  title?: string;
}

export type FullCalendarView =
  | "dayGridMonth"
  | "dayGridWeek"
  | "dayGridDay"
  | "listWeek";

export interface CalendarCardConfig extends LovelaceCardConfig {
  entities: string[];
  initial_view?: FullCalendarView;
  title?: string;
  theme?: string;
}

export interface TodoListCardConfig extends LovelaceCardConfig {
  title?: string;
  theme?: string;
  entity?: string;
  hide_completed?: boolean;
  hide_create?: boolean;
  hide_section_headers?: boolean;
  sort?: string;
}

export type EntityNameItem =
  | {
      type: "entity" | "device" | "area" | "floor";
    }
  | {
      type: "text";
      text: string;
    };

export type ModernForecastType = "hourly" | "daily" | "twice_daily";
export type ForecastType = ModernForecastType | "legacy";

export interface WeatherForecastCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string | EntityNameItem | EntityNameItem[];
  show_current?: boolean;
  show_forecast?: boolean;
  forecast_type?: ForecastType;
  forecast_slots?: number;
  secondary_info_attribute?: "visibility" | "dew_point" | "air_pressure" | "humidity" | "temperature" | "wind_speed" | "precipitation" | undefined;
  round_temperature?: boolean;
  theme?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface LovelaceColorfulcloudsWeatherCardConfig extends LovelaceCardConfig {
  type: 'custom:weather-card'
  entity: string
  show_houer: boolean
  show_daily: boolean
  show_realtime: boolean
  icon: '/hacsfiles/lovelace-colorfulclouds-weather-card/icons/animated/'
  secondary_info_attribute: 'wind_bearing'
}

export enum TimeFormat {
  language = "language",
  system = "system",
  am_pm = "12",
  twenty_four = "24",
}

export interface ClockCardConfig extends LovelaceCardConfig {
  type: "custom:chuguan-clock-card";
  title?: string;
  clock_style?: "digital" | "analog";
  clock_size?: "small" | "medium" | "large";
  show_seconds?: boolean | undefined;
  seconds_motion?: "continuous" | "tick";
  time_format?: TimeFormat;
  time_zone?: string;
  no_background?: boolean;
  // Analog clock options
  border?: boolean;
  ticks?: "none" | "quarter" | "hour" | "minute";
  face_style?: "markers" | "numbers_upright" | "roman";
}

export enum TimeZone {
  local = "local",
  server = "server",
}

const RESOLVED_TIME_ZONE = Intl.DateTimeFormat?.().resolvedOptions?.().timeZone;

export const LOCAL_TIME_ZONE = RESOLVED_TIME_ZONE ?? "UTC";


export const resolveTimeZone = (option: TimeZone, serverTimeZone: string) =>
  option === TimeZone.local && RESOLVED_TIME_ZONE
    ? LOCAL_TIME_ZONE
    : serverTimeZone;

export enum NumberFormat {
  language = "language",
  system = "system",
  comma_decimal = "comma_decimal",
  decimal_comma = "decimal_comma",
  quote_decimal = "quote_decimal",
  space_comma = "space_comma",
  none = "none",
}

export enum DateFormat {
  language = "language",
  system = "system",
  DMY = "DMY",
  MDY = "MDY",
  YMD = "YMD",
}

export enum FirstWeekday {
  language = "language",
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
  sunday = "sunday",
}

export interface FrontendLocaleData {
  language: string;
  number_format: NumberFormat;
  time_format: TimeFormat;
  date_format: DateFormat;
  first_weekday: FirstWeekday;
  time_zone: TimeZone;
}

export const useAmPm = memoizeOne((locale: FrontendLocaleData): boolean => {
  if (
    locale.time_format === TimeFormat.language ||
    locale.time_format === TimeFormat.system
  ) {
    const testLanguage =
      locale.time_format === TimeFormat.language ? locale.language : undefined;
    const test = new Date("January 1, 2023 22:00:00").toLocaleString(
      testLanguage
    );
    return test.includes("10");
  }

  return locale.time_format === TimeFormat.am_pm;
});

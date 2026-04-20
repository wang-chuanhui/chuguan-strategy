import WeatherCard from "../cards/WeatherCard";
import { Registry } from "../Registry";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";

function getWeatherCards(): LovelaceCardConfig[] {
    const entity = Registry.entities.filter((entity) => entity.entity_id.startsWith('weather.'))[0];
    if (!entity) {
      return []
    }
    const weatherCards = [WeatherCard.createCard(entity, {} as any)]
    return weatherCards;
  }

export function getWallPanelConfig() {
    const weatherCards = getWeatherCards()
    return {
        wallpanel: {
            enabled: true,
            hide_toolbar: false,
            hide_sidebar: false,
            fullscreen: false,
            idle_time: 10,
            enabled_on_views: [],
            display_time: 60,
            stop_screensaver_on_mouse_move: false,
            stop_screensaver_on_key_down: false,
            show_progress_bar: false,
            cards: [
                {
                    type: 'custom:chuguan-clock-card',
                    clock_style: 'digital',
                    clock_size: 'large',
                    show_seconds: false,
                    seconds_motion: 'tick',
                    time_format: 24,
                    no_background: false,
                    border: false,
                    ticks: 'minute',
                    face_style: 'markers',
                    show_date: true
                },
                ...weatherCards
            ],
        }
    }
}
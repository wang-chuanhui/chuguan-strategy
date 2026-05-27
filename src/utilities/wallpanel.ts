import WeatherCard from "../cards/WeatherCard";
import { Registry } from "../Registry";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";

function getWeatherCards(): LovelaceCardConfig[] {
    const entity = Registry.entities.filter((entity) => entity.entity_id.startsWith('weather.'))[0];
    if (!entity) {
      return []
    }
    const weatherCards = [{...WeatherCard.createCard(entity, {} as any), no_background: true, no_border: true}]
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
            idle_time: 60,
            enabled_on_views: [],
            display_time: 60,
            show_progress_bar: false,
            show_images: false,
            touch_zone_size_next_image: 0, 
            touch_zone_size_previous_image: 0,
            cards: [
                ...weatherCards,
                {
                    type: 'custom:chuguan-clock-card',
                    clock_style: 'digital',
                    clock_size: 'huge',
                    show_seconds: false,
                    seconds_motion: 'tick',
                    time_format: 24,
                    no_background: true,
                    border: false,
                    ticks: 'minute',
                    face_style: 'markers',
                    show_date: true, 
                    no_border: true,
                },
            ],
        }
    }
}
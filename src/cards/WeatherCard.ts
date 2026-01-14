import { HassEntity } from "home-assistant-js-websocket";
import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { LovelaceColorfulcloudsWeatherCardConfig, WeatherForecastCardConfig } from "../types/homeassistant/panels/lovelace/cards/types";
import AbstractCard from "./AbstractCard";
import { Registry } from "../Registry";


export default class WeatherCard extends AbstractCard {

    static getDefaultCardConfig() : WeatherForecastCardConfig {
        return {
            entity: '',
            type: "weather-forecast",
            show_current: true, 
            show_forecast: false, 
            forecast_type: 'hourly', 
            secondary_info_attribute: 'wind_speed', 
            round_temperature: true
        }
    }

    has_daily = false
    has_hourly = false
    has_twice_daily = false

    constructor(entity: EntityRegistryEntry, customConfiguration: WeatherForecastCardConfig) {
        super(entity);
        this.setupFeatures(entity);

        this.configuration = {
            ...this.configuration,
            ...WeatherCard.getDefaultCardConfig(),
            ...customConfiguration, 
            entity: entity.entity_id
        }
        if (this.has_hourly) {
            this.configuration.show_forecast = true
            this.configuration.forecast_type = 'hourly'
        }else if (this.has_twice_daily) {
            this.configuration.show_forecast = true
            this.configuration.forecast_type = 'twice_daily'
        }else if (this.has_daily) {
            this.configuration.show_forecast = true
            this.configuration.forecast_type = 'daily'
        }else {
            this.configuration.show_forecast = true
            this.configuration.forecast_type = 'legacy'
        }
    }

    setupFeaturesSupported(entity: EntityRegistryEntry, supported_features: number): void {
        this.has_daily = (supported_features & 1) !== 0
        this.has_hourly = (supported_features & 2) !== 0
        this.has_twice_daily = (supported_features & 4) !== 0
    }

    static createCard(entity: EntityRegistryEntry, customConfiguration: any) {
        if (entity.platform == 'tianqi' && customElements.get('weather-card')) {
            const state = Registry.hassStates[entity.entity_id]
            if (state?.attributes?.support_caiyun) {
                return new LovelaceColorfulcloudsWeatherCard(entity, customConfiguration).getCard()
            }
        }
        return new WeatherCard(entity, customConfiguration).getCard()
    }

}


export class LovelaceColorfulcloudsWeatherCard extends AbstractCard {

    static getDefaultCardConfig(): LovelaceColorfulcloudsWeatherCardConfig {
        return {
            type: 'custom:weather-card',
            entity: '',
            show_houer: true,
            show_daily: true,
            show_realtime: true,
            icon: '/hacsfiles/lovelace-colorfulclouds-weather-card/icons/animated/',
            secondary_info_attribute: 'wind_bearing',
        }
    }

    has_daily = false
    has_hourly = false

        constructor(entity: EntityRegistryEntry, customConfiguration: LovelaceColorfulcloudsWeatherCardConfig) {
        super(entity);
        this.setupFeatures(entity);

        this.configuration = {
            ...this.configuration,
            ...LovelaceColorfulcloudsWeatherCard.getDefaultCardConfig(),
            ...customConfiguration, 
            entity: entity.entity_id
        }
        if (this.has_hourly) {
            this.configuration.show_houer = true
        }
        if (this.has_daily) {
            this.configuration.show_daily = true
        }
    }

    setupFeaturesSupported(entity: EntityRegistryEntry, supported_features: number): void {
        this.has_daily = (supported_features & 1) !== 0
        this.has_hourly = (supported_features & 2) !== 0
    }

}
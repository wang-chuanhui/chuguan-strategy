import { HassEntity } from "home-assistant-js-websocket";
import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { WeatherForecastCardConfig } from "../types/homeassistant/panels/lovelace/cards/types";
import AbstractCard from "./AbstractCard";


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

}
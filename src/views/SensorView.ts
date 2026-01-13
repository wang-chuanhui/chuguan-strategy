import SensorCard from "../cards/SensorCard";
import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import { CustomHeaderCardConfig } from "../types/strategy/strategy-cards";
import { ViewConfig } from "../types/strategy/strategy-views";
import { localize } from "../utilities/localize";
import AbstractView from "./AbstractView";


export default class SensorView extends AbstractView {

    static readonly domain = 'sensor' as const

    static getDefaultConfig(): ViewConfig {
        return {
            title: localize('sensor.sensors'),
            icon: 'mdi:water',
            path: 'sensor', 
            subview: false
        }
    }

    static getViewHeaderCardConfig(): CustomHeaderCardConfig {
        return {
            title: localize('sensor.sensors'),
        }
    }

    protected domains(): Record<string, boolean | string[]> {
        return {
            sensor: true, 
            binary_sensor: true,
        }
    }

    constructor(customConfiguration: ViewConfig) {
        super()
        this.initializeViewConfig(
            SensorView.getDefaultConfig(), 
            customConfiguration, 
            SensorView.getViewHeaderCardConfig()
        )
    }

    protected async createCard(entity: EntityRegistryEntry): Promise<any> {
        const domain = entity.entity_id.split('.')[0]
        if (domain == 'sensor') {
            return await SensorCard.createCard(entity)
        }
        return await super.createCard(entity)
    }

}
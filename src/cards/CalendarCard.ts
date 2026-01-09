import { Registry } from "../Registry";
import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import { CalendarCardConfig } from "../types/homeassistant/panels/lovelace/cards/types";
import { EntityCardConfig } from "../types/lovelace-mushroom/cards/entity-card-config";
import AbstractCard from "./AbstractCard";


class CalendarCard extends AbstractCard {

    static getDefaultConfig(): CalendarCardConfig {
        return {
            type: 'calendar',
            entities: [],
            initial_view: 'dayGridMonth',
        }
    }

    constructor(entities: EntityRegistryEntry[], customConfiguration?: CalendarCardConfig) {
        super(entities[0]);
        this.configuration = { ...this.configuration, ...CalendarCard.getDefaultConfig(), ...customConfiguration };
        this.configuration.entities = entities.map((entity) => entity.entity_id);
    }

}

export class CalendarProCard extends AbstractCard {

    static getDefaultConfig(): LovelaceCardConfig {
        return {
            type: 'custom:calendar-card-pro',
            entities: [],
            weather: {
                position: 'both',
                date: {
                    show_low_temp: true
                },
                entity: undefined
            }
        }
    }

    constructor(entities: EntityRegistryEntry[], customConfiguration?: LovelaceCardConfig) {
        super(entities[0]);
        const language = Registry.config.hass.language
        if (language) {
            this.configuration.language = language;
            if (language == 'zh-Hans') {
                this.configuration.language = 'zh-cn'
            }else if (language == 'zh-Hant') {
                this.configuration.language = 'zh-tw'
            }
        }
        this.configuration = { ...this.configuration, ...CalendarProCard.getDefaultConfig(), ...customConfiguration };
        this.configuration.entities = entities.map((entity) => entity.entity_id);
    }

}

export default CalendarCard;
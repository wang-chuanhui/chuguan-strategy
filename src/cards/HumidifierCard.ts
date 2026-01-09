import { Registry } from "../Registry";
import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { HumidifierCardConfig } from "../types/lovelace-mushroom/cards/humidifier-card-config";
import { RegistryEntry } from "../types/strategy/strategy-generics";
import AbstractCard from "./AbstractCard";


class HumidifierCard extends AbstractCard {

    static getDefaultConfig(): HumidifierCardConfig {
        return {
            type: 'custom:mushroom-humidifier-card',
            show_target_humidity_control: true,
            collapsible_controls: false,
            layout: 'horizontal', 
            icon: undefined
        }
    }

    has_target_humidity = false

    constructor(entity: EntityRegistryEntry, customConfiguration: HumidifierCardConfig) {
        super(entity);
        this.configuration = { ...this.configuration, ...HumidifierCard.getDefaultConfig(), ...customConfiguration };
    }

    is_card_active(entity: RegistryEntry) {
        return this.is_generic_card_active(entity)
    }

}

export default HumidifierCard;
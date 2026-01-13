import { HassEntity } from "home-assistant-js-websocket";
import { Registry } from "../Registry";
import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { LovelaceCardConfig, TileCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import { TitleCardConfig } from "../types/lovelace-mushroom/cards/title-card-config";
import AbstractCard from "./AbstractCard";


export default class TileCard extends AbstractCard {

    static getDefaultConfig(): TileCardConfig {
        return {
            type: 'tile',
            icon: undefined,
            line_color: undefined, 
            entity: ''
        };
    }

    constructor(entity: EntityRegistryEntry, customConfiguration?: LovelaceCardConfig) {
        super(entity);
        this.setupFeatures(entity);
        this.configuration = { ...this.configuration, ...(this.constructor as typeof TileCard).getDefaultConfig(), ...this.getSubConfiguration(), ...customConfiguration };
    }

    getSubConfiguration(): Partial<TitleCardConfig> {
        return {}
    }

}
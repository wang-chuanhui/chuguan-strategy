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
        console.log(this.getSubConfiguration(), customConfiguration)
        this.configuration = { ...this.configuration, ...(this.constructor as typeof TileCard).getDefaultConfig(), ...this.getSubConfiguration(), ...customConfiguration };
        console.log(this.configuration)
    }

    getSubConfiguration(): Partial<TitleCardConfig> {
        return {}
    }

    setupFeatures(entity: EntityRegistryEntry) {
        const state = Registry.hassStates[entity.entity_id];
        if (!state) {
            return
        }
        this.setupFeaturesState(entity, state);
        const supported_features = state.attributes.supported_features
        if (!supported_features) {
            return
        }
        this.setupFeaturesSupported(entity, supported_features);
    }

    setupFeaturesState(entity: EntityRegistryEntry, state: HassEntity) {

    }

    setupFeaturesSupported(entity: EntityRegistryEntry, supported_features: number) {

    }
}
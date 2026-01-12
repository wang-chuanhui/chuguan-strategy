import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { LovelaceCardConfig, TileCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import TileCard from "./TileCard";


export default class UpdateCard extends TileCard {

    static getDefaultConfig(): TileCardConfig {
        return {
            type: 'tile',
            icon: undefined,
            line_color: undefined, 
            entity: ''
        };
    }

    constructor(entity: EntityRegistryEntry, customConfiguration?: LovelaceCardConfig) {
        super(entity, customConfiguration);
        this.configuration = {
            ...this.configuration, 
            visibility: [
                {
                    condition: 'state', 
                    entity: entity.entity_id,
                    state: 'on',
                }
            ]
        }
    }

}

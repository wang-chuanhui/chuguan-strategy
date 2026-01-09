import { HassEntity } from "home-assistant-js-websocket";
import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import TileCard from "./TileCard";
import { TileCardConfig } from "../types/homeassistant/data/lovelace/config/card";

export default class TextCard extends TileCard {

    isPassword = false

    setupFeaturesState(entity: EntityRegistryEntry, state: HassEntity): void {
        this.isPassword = state.attributes.mode == 'password'
    }

    getSubConfiguration(): Partial<TileCardConfig> {
        return {
            state_content: this.isPassword ? '********' : undefined,
            hide_state: this.isPassword
        }
    }

}
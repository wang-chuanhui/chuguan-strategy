import { Registry } from "../Registry";
import { AlarmMode } from "../types/homeassistant/data/alarm_control_panel";
import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { AlarmControlPanelCardConfig } from "../types/lovelace-mushroom/cards/alarm-control-panel-card-config";
import { isCallServiceActionConfig } from "../types/strategy/strategy-generics";
import AbstractCard from "./AbstractCard";

class AlarmControlPanelCard extends AbstractCard {

    static getDefaultConfig(): AlarmControlPanelCardConfig {
        return {
            type: 'custom:mushroom-alarm-control-panel-card',
            icon: undefined,
            layout: 'horizontal',
        }
    }
    constructor(entity: EntityRegistryEntry, customConfiguration?: AlarmControlPanelCardConfig) {
        super(entity);

        const configuration = AlarmControlPanelCard.getDefaultConfig()
        if (isCallServiceActionConfig(configuration.tap_action)) {
            configuration.tap_action.target = {
                entity_id: entity.entity_id
            }
        }
        configuration.icon = Registry.hassStates[entity.entity_id]?.attributes.icon ?? configuration.icon;

        this.configuration = { ...this.configuration, ...configuration, ...this.getSubClassCustomCardConfig(entity), ...customConfiguration };
    }

    protected getSubClassCustomCardConfig(entity: EntityRegistryEntry): AlarmControlPanelCardConfig | null | undefined {
        const state = Registry.hassStates[entity.entity_id];
        if (!state) {
            return null
        }
        const supported_features = state.attributes.supported_features
        if (!supported_features) {
            return null
        }
        const states: AlarmMode[] = []
        if (supported_features & 0x1) states.push('armed_home')
        if (supported_features & 0x2) states.push('armed_away')
        if (supported_features & 0x4) states.push('armed_night')
        // Don't show these on card, activate via popup
        // if (supported_features & 0x10) states.push('armed_custom_bypass')
        // if (supported_features & 0x20) states.push('armed_vacation')
        return {
            states: states
        } as AlarmControlPanelCardConfig
    }

    is_card_active(entity: EntityRegistryEntry) {
        return this.is_generic_card_active(entity, '!=', 'disarmed')
    }


}

export default AlarmControlPanelCard

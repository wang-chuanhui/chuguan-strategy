import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { CustomHeaderCardConfig } from "../types/strategy/strategy-cards";
import { ViewConfig } from "../types/strategy/strategy-views";
import { localize } from "../utilities/localize";
import AbstractView from "./AbstractView";

class SecurityView extends AbstractView {

    static readonly domain = "security" as const

    static getDefaultConfig(): ViewConfig {
        return {
            title: localize('security.title'),
            path: 'security',
            icon: 'mdi:security',
            subview: false,
        }
    }

    static getViewHeaderCardConfig(): CustomHeaderCardConfig {
        return {
            title: localize('security.title'),
        }
    }

    protected domains(): Record<string, boolean | string[]> {
        return {
            'lock': true,
            'camera': true,
            'alarm_control_panel': true,
            'cover': ['door', 'garage', 'gate', 'window'],
            'binary_sensor': ['co', 'gas', 'door', 'garage_door', 'lock', 'motion', 'problem', 'safety', 'smoke', 'tamper', 'window']
        }
    }

    constructor(customConfiguration: ViewConfig) {
        super()
        this.initializeViewConfig(SecurityView.getDefaultConfig(), customConfiguration, SecurityView.getViewHeaderCardConfig())
    }

}

export default SecurityView
import CameraCard from "../cards/CameraCard";
import HeaderCard from "../cards/HeaderCard";
import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";
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
            'binary_sensor': ['co', 'gas', 'door', 'garage_door', 'lock', 'motion', 'problem', 'safety', 'smoke', 'tamper', 'window'], 
            'siren': true
        }
    }

    constructor(customConfiguration: ViewConfig) {
        super()
        this.initializeViewConfig(SecurityView.getDefaultConfig(), customConfiguration, SecurityView.getViewHeaderCardConfig())
    }

    protected async createAreaCards(area: { area_id: string; name: string; }, domainEntities: EntityRegistryEntry[], index: number): Promise<LovelaceCardConfig[] | null> {
        if (area.area_id == 'undisclosed') {
            const cameras = domainEntities.filter(entity => entity.entity_id.startsWith('camera.'))
            const res: LovelaceCardConfig[] = []
            if (cameras.length > 0) {
                const header = new HeaderCard({}, { title: localize('camera.cameras') }).createCard()
                const cameraCards = cameras.map(item => {
                    return new CameraCard(item, this.getCustomCardConfig(item) as any).getCard()
                })
                if (cameraCards) {
                    res.push(header, ...cameraCards)
                }
                const others = domainEntities.filter(entity => !entity.entity_id.startsWith('camera.'))
                if (others.length > 0) {
                    const otherCards = await super.createAreaCards(area, others, index)
                    if (otherCards) {
                        res.push(...otherCards)
                    }
                }
                return res
            }
        }
        return super.createAreaCards(area, domainEntities, index)
    }

}

export default SecurityView
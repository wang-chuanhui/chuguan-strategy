

//      Registry._config = await info.hass.callWS({type: 'lovelace/config',url_path: "dashboard-cg"}) as Promise<any>

import { Registry } from "../Registry";
import { HomeAssistant } from "../types/homeassistant/types";
import { StrategyArea, StrategyConfig } from "../types/strategy/strategy-generics";
import { SortItem } from "../types/strategy/strategy-model";

export class ConfigManager {

    hass: HomeAssistant
    options: Partial<StrategyConfig> = {}
    areas: StrategyArea[] = []

    constructor(hass: HomeAssistant) {
        this.hass = hass
    }

    private getCurrentDashboardKey(): string | null {
        try {
            const currentPath = window.location.pathname;

            const dashboardMatch = currentPath.match(/\/([^\/]+)/);
            if (dashboardMatch && dashboardMatch[1]) {
                const dashboardKey = dashboardMatch[1];

                // SPECIAL CASE: For Home Assistant storage, 'lovelace' should be null (default dashboard)
                // but for component isolation, we'll use 'lovelace' in other methods
                if (dashboardKey === 'lovelace') {
                    return null; // Default dashboard for HA storage
                }

                return dashboardKey;
            }

            console.warn('🔑 Could not extract dashboard key from path:', currentPath);
            return null; // Default fallback for storage
        } catch (error) {
            console.error('🏠 CHUGUAN: Error getting dashboard key:', error);
            return null;
        }
    }

    async getConfig() {
        const key = this.getCurrentDashboardKey()
        if (key == null) {
            return
        }
        const config = await this.hass.callWS({ type: 'lovelace/config', url_path: key })
        return config
    }

    async saveConfig(config: StrategyConfig) {
        const key = this.getCurrentDashboardKey()
        if (key == null) {
            return
        }
        const data = {
            strategy: {
                type: 'custom:chuguan-strategy',
                options: config
            }
        }
        console.log(data)
        await this.hass.callWS({ type: 'lovelace/config/save', url_path: key, config: data })
    }

    async saveAreaSort(details: SortItem[]) {
        if (this.options.areas == null) {
            this.options.areas = {}
        }
        for (const item of details) {
            let area = this.options.areas[item.id]
            if (area == null) {
                area = {
                    order: item.order,
                    hidden: !item.visible
                } as StrategyArea
                this.options.areas[item.id] = area
            }
            if (area) {
                area.order = item.order
                area.hidden = !item.visible
            }
        }
        await this.saveConfig(this.options as StrategyConfig)
    }

}
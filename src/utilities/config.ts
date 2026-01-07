

//      Registry._config = await info.hass.callWS({type: 'lovelace/config',url_path: "dashboard-cg"}) as Promise<any>

import { Registry } from "../Registry";
import { HomeAssistant } from "../types/homeassistant/types";
import { StrategyArea, StrategyConfig, StrategyViewConfig, SupportedDomains, SupportedViews } from "../types/strategy/strategy-generics";
import { SortItem } from "../types/strategy/strategy-model";

export class ConfigManager {

    hass: HomeAssistant
    options: Partial<StrategyConfig> = {}
    areas: StrategyArea[] = []

    constructor(hass: HomeAssistant) {
        this.hass = hass
        document.addEventListener('cg_sort_area', (e) => {
            const detail: SortItem[] = (e as CustomEvent).detail;
            this.saveAreaSort(detail)
        })
        document.addEventListener('cg_sort_domains', (e) => {
            const detail: SortItem[] = (e as CustomEvent).detail;
            this.saveDomainSort(detail)
        })
    }

    getCurrentDashboardKey(): string | null {
        return this.hass.panelUrl
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
            } else {
                area.order = item.order
                area.hidden = !item.visible
            }
        }
        await this.saveConfig(this.options as StrategyConfig)
        window.location.reload()
    }

    async saveDomainSort(details: SortItem[]) {
        if (this.options.views == null) {
            this.options.views = {} as any
        }
        const min = Math.min(...details.map(i => i.order))
        const add = 2 - min
        for (const item of details) {
            const key = item.id as SupportedViews
            let view = this.options.views![key]
            if (view == null) {
                view = {
                    order: item.order + add,
                    hidden: !item.visible
                } as StrategyViewConfig
                this.options.views![key] = view
            } else {
                view.order = item.order + add
                view.hidden = !item.visible
            }
        }
        await this.saveConfig(this.options as StrategyConfig)
    }

}
import { Registry } from "../Registry";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import { StrategyViewConfig } from "../types/strategy/strategy-generics";
import { gen_background } from "../utilities/background";
import { localize } from "../utilities/localize";



export default class AreaSortView {

    constructor(options: any = {}) {

    }

    getViews(): StrategyViewConfig[] {
        return [{
            title: localize('setting.area_sort'),
            path: 'area_sort',
            back_path: 'setting',
            subview: true,
            hidden: false,
            order: Infinity,
            strategy: {
                type: 'custom:chuguan-strategy',
                options: {
                    type: 'area_sort',
                },
            },
            background: gen_background('setting'),
        } as StrategyViewConfig]
    }

    async getCards(): Promise<LovelaceCardConfig[]> {
        const cards: LovelaceCardConfig[] = []

        const verticalStackCards: LovelaceCardConfig[] = []
        verticalStackCards.push(this.getSortAres())

        cards.push({
            type: 'vertical-stack',
            cards: verticalStackCards
        })
        console.log(cards)
        return cards
    }

    getSortAres(): LovelaceCardConfig {
        const areas = Registry.config.areas
        const areaList = areas.map((area, index) => ({
            id: area.area_id,
            name: area.name,
            visible: !area.hidden,
            order: area.order ?? index + 1,
        }))
        return {
            type: 'custom:chuguan-sort-list',
            list: areaList, 
            event: 'cg_sort_area', 
            action: {
                action: 'navigate',
                navigation_path: 'setting'
            }
        }
    }

}
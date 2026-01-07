import { gen_background } from "../utilities/background";
import { StrategyViewConfig } from "../types/strategy/strategy-generics";
import { localize } from "../utilities/localize";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import { Registry } from "../Registry";


export class SettingView {

    constructor() {

    }

    getView(): StrategyViewConfig {
        return {
            title: localize('setting.title'),
            path: 'setting',
            subview: false,
            hidden: false,
            order: Infinity,
            strategy: {
                type: 'custom:chuguan-strategy',
                options: {
                    type: 'setting',
                },
            },
            background: gen_background('setting'),
        } as StrategyViewConfig
    }

    async getCards(): Promise<LovelaceCardConfig[]> {
        const cards: LovelaceCardConfig[] = []

        const verticalStackCards: LovelaceCardConfig[] = []
        verticalStackCards.push(...this.getSidebar())
        verticalStackCards.push(this.getSortAres())

        cards.push({
            type: 'vertical-stack',
            cards: verticalStackCards
        })
        console.log(cards)
        return cards
    }

    getSidebar(): LovelaceCardConfig[] {
        return [{
            type: 'horizontal-stack',
            cards: [
                {
                    type: 'custom:chuguan-event-button',
                    title: localize('event.hide_sidebar'),
                    event: 'cg_hide_sidebar',
                },
                {
                    type: 'custom:chuguan-event-button',
                    title: localize('event.show_sidebar'),
                    event: 'cg_show_sidebar',
                },
            ],
        }]
    }

    getSortAres(): LovelaceCardConfig {
        const areas = Registry.areas
        const areaList = areas.map((area, index) => ({
            id: area.area_id,
            name: area.name,
            visible: !area.hidden,
            order: area.order ?? index + 1,
        }))
        return {
            type: 'custom:chuguan-sort-list',
            list: areaList,
            title: localize('setting.area_sort'),
            event: 'cg_sort_area',
            action: () => {
                console.log('sort area')
            }
        }
    }

}
import { Registry } from "../Registry";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import { isSupportedView, SingleDomainConfig, StrategyViewConfig, SupportedDomains } from "../types/strategy/strategy-generics";
import { gen_background } from "../utilities/background";
import { localize } from "../utilities/localize";



export default class DomainSortView {

    constructor(options: any = {}) {

    }



    getViews(): StrategyViewConfig[] {
        return [{
            title: localize('setting.domain_sort'),
            path: 'domain_sort',
            back_path: 'setting',
            subview: true,
            hidden: false,
            order: Infinity,
            strategy: {
                type: 'custom:chuguan-strategy',
                options: {
                    type: 'domain_sort',
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
        return cards
    }

    getSortAres(): LovelaceCardConfig {
        const views = Registry.strategyOptions.views
        console.log(views)
        const domains = Object.keys(views).filter((key) => key !== '_' && key !== 'default').filter(i => i != 'home').filter(isSupportedView)
        const domainList = domains.map((domain, index) => {
            const config = Registry.strategyOptions.views[domain]
            const d = Registry.strategyOptions.domains[domain as SupportedDomains] as SingleDomainConfig
            return {
                id: domain,
                name: d?.title ?? domain,
                visible: !config.hidden,
                order: config.order ?? index + 2,
            }
        })
        console.log(domainList)
        return {
            type: 'custom:chuguan-sort-list',
            list: domainList,
            event: 'cg_sort_domains',
            action: {
                action: 'navigate',
                navigation_path: 'setting'
            }
        }
    }

}
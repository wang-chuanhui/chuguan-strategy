import { gen_background } from "../utilities/background";
import { StrategyViewConfig } from "../types/strategy/strategy-generics";
import { localize } from "../utilities/localize";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import { Registry } from "../Registry";
import AreaSortView from "./AreaSortView";
import { ActionsSharedConfig } from "../types/lovelace-mushroom/shared/config/actions-config";
import { TemplateCardConfig } from "../types/lovelace-mushroom/cards/template-card-config";
import DomainSortView from "./DomainSortView";
import "../shared/DockedSidebar";



export default class SettingView {

    constructor() {

    }

    getViews(): StrategyViewConfig[] {
        return [{
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
        } as StrategyViewConfig, ...new AreaSortView().getViews(), ...new DomainSortView().getViews()]
    }

    async getCards(): Promise<LovelaceCardConfig[]> {
        const cards: LovelaceCardConfig[] = []

        const verticalStackCards: LovelaceCardConfig[] = []
        verticalStackCards.push(...this.getSidebar())
        verticalStackCards.push(this.getSortAres())
        verticalStackCards.push(this.getSortDomain())

        cards.push({
            type: 'vertical-stack',
            cards: verticalStackCards
        })
        return cards
    }

    getSidebar(): LovelaceCardConfig[] {
        return [{
            type: 'custom:chuguan-docked-sidebar',
        }]
    }

    getSortAres(): TemplateCardConfig {
        return {
            type: 'custom:mushroom-template-card',
            primary: localize('setting.area_sort'),
            icon: 'mdi:floor-plan',
            icon_color: 'blue',
            tap_action: {
                action: 'navigate',
                navigation_path: 'area_sort',
                navigation_replace: true,
            },
            hold_action: {
                action: 'none',
            },
            double_tap_action: {
                action: 'none',
            },
        }
    }

    getSortDomain(): TemplateCardConfig {
        return {
            type: 'custom:mushroom-template-card',
            primary: localize('setting.domain_sort'),
            icon: 'mdi:domain',
            icon_color: 'blue',
            tap_action: {
                action: 'navigate',
                navigation_path: 'domain_sort',
                navigation_replace: true,
            },
            hold_action: {
                action: 'none',
            },
            double_tap_action: {
                action: 'none',
            },
        }
    }

    editBackground(): TemplateCardConfig {
        return {
            type: 'custom:mushroom-template-card',
            primary: localize('setting.domain_sort'),
            icon: 'mdi:domain',
            icon_color: 'blue',
            tap_action: {
                action: 'fire-dom-event', 
                detail: {
                    event: 'cg_edit_background',
                }
            } as any,
            hold_action: {
                action: 'none',
            },
            double_tap_action: {
                action: 'none',
            },
        }
    }

}
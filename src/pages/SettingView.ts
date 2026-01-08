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
        verticalStackCards.push({
            type: 'custom:chuguan-event-button',
            title: "测试",
            event: 'll-edit-card',
            detail: {
                path: [0, 2, 1]
            },
            event11: 'show-dialog',
            detail1: {
                "dialogTag": "hui-dialog-edit-card",
                "dialogParams": {
                    "lovelaceConfig": {
                        "views": [{
                            "type": "sections",
                            "max_columns": 4,
                            "title": "12",
                            "path": "12",
                            "sections": [{
                                "type": "grid",
                                "cards": [{
                                    "type": "heading",
                                    "heading": "新建部件"
                                }]
                            }, {
                                "type": "grid",
                                "cards": [{
                                    "type": "heading",
                                    "heading": "新建部件"
                                }, {
                                    "show_name": true,
                                    "show_icon": true,
                                    "type": "button",
                                    "tap_action": {
                                        "action": "toggle"
                                    },
                                    "entity": "switch.wifiliang_yi_jia_xiao_du"
                                }],
                                "column_span": 1
                            }, {
                                "type": "grid",
                                "cards": [{
                                    "type": "heading",
                                    "heading": "新建部件"
                                }, {
                                    "type": "custom:mushroom-light-card",
                                    "entity": "light.tai_deng"
                                }]
                            }],
                            "background": {
                                "opacity": 31,
                                "alignment": "center",
                                "size": "cover",
                                "repeat": "repeat",
                                "attachment": "scroll"
                            },
                            "cards": []
                        }, {
                            "title": "Home",
                            "sections": [{
                                "type": "grid",
                                "cards": [{
                                    "type": "heading",
                                    "heading": "新建部件",
                                    "heading_style": "title",
                                    "icon": "mdi:account"
                                }, {
                                    "show_name": true,
                                    "show_icon": false,
                                    "type": "button",
                                    "tap_action": {
                                        "action": "perform-action",
                                        "perform_action": "button.press",
                                        "target": {
                                            "entity_id": "button.liang_yi_jia_chui_feng"
                                        }
                                    },
                                    "entity": "button.liang_yi_jia_chui_feng",
                                    "show_state": false,
                                    "icon": "mdi:button-pointer"
                                }, {
                                    "show_name": true,
                                    "show_icon": true,
                                    "type": "button",
                                    "tap_action": {
                                        "action": "perform-action",
                                        "perform_action": "button.press",
                                        "target": {
                                            "entity_id": "button.liang_yi_jia_chui_feng"
                                        },
                                        "data": {}
                                    },
                                    "entity": "button.liang_yi_jia_chui_feng"
                                }]
                            }, {
                                "type": "grid",
                                "cards": [{
                                    "type": "heading",
                                    "heading": "新建部件"
                                }, {
                                    "type": "custom:mushroom-entity-card",
                                    "entity": "button.liang_yi_jia_chui_feng",
                                    "fill_container": false,
                                    "tap_action": {
                                        "action": "perform-action",
                                        "perform_action": "button.press",
                                        "target": {
                                            "entity_id": "button.liang_yi_jia_chui_feng"
                                        }
                                    }
                                }, {
                                    "type": "thermostat",
                                    "entity": "climate.kong_diao"
                                }]
                            }]
                        }, {
                            "type": "sections",
                            "max_columns": 4,
                            "title": "5312",
                            "path": "5312",
                            "sections": [{
                                "type": "grid",
                                "cards": [{
                                    "type": "heading",
                                    "heading": "新建部件"
                                }]
                            }]
                        }]
                    },
                    "path": [0, 2],
                    "cardIndex": 1, 
                    saveConfig: (e: any) => {
                        console.log(e)
                    }
                }
            },
            detail11: {
                dialogTag: "hui-dialog-edit-card",
                cardIndex: 0,
                path: [0, 0],
                lovelaceConfig: {
                    views: [
                        {
                            type: "sections",
                            sections: [
                                {
                                    cards: [
                                        {
                                            type: 'custom:mushroom-light-card'
                                        }
                                    ],
                                    type: 'grid'
                                }
                            ]
                        }
                    ]
                }
            }
        })

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
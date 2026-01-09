import { HassServiceTarget } from "home-assistant-js-websocket";
import { Registry } from "../Registry";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import { isSupportedDomain, NotInAreaDomains, StrategyArea, StrategyViewConfig } from "../types/strategy/strategy-generics";
import RegistryFilter from "../utilities/RegistryFilter";
import { sanitizeClassName } from "../utilities/auxiliaries";
import HeaderCard from "../cards/HeaderCard";
import SensorCard from "../cards/SensorCard";
import { stackHorizontal } from "../utilities/cardStacking";
import { logMessage, lvlError } from "../utilities/debug";
import { gen_background } from "../utilities/background";
import { EntityCardConfig } from "../types/lovelace-mushroom/cards/entity-card-config";
import { entityIcon } from "../types/homeassistant/data/icons";


export class AreaView {

    area: StrategyArea

    constructor(area: StrategyArea) {
        this.area = area;
    }

    getView(): StrategyViewConfig {
        const area = this.area
        return {
            title: area.name,
            path: area.area_id,
            subview: false,
            hidden: area.hidden ?? false,
            order: area.order ?? Infinity,
            strategy: {
                type: 'custom:chuguan-strategy',
                options: { area },
            },
            background: gen_background(area.area_id)
        } as StrategyViewConfig
    }

    static getView(area: StrategyArea, order: number): StrategyViewConfig {
        const view = new AreaView(area).getView();
        view.order = order;
        return view;
    }

    async getCards(): Promise<LovelaceCardConfig[]> {
        const exposedDomainNames = Registry.getExposedNames('domain');
        const area = this.area;
        const areaEntities = new RegistryFilter(Registry.entities).whereAreaId(area.area_id).whereNotDomain(NotInAreaDomains).toList();
        const viewCards: LovelaceCardConfig[] = [...(area.extra_cards ?? [])];

        // Set the target for any Header card to the current area.
        const target: HassServiceTarget = { area_id: [area.area_id] };

        // Prepare promises for all supported domains
        const domainCardPromises = exposedDomainNames.filter(isSupportedDomain).map(async (domain) => {
            const moduleName = sanitizeClassName(domain + 'Card');

            const entities = new RegistryFilter(areaEntities)
                .whereDomain(domain)
                .where((entity) => !(domain === 'switch' && entity.entity_id.endsWith('_stateful_scene')))
                .toList();

            if (!entities.length) {
                return null;
            }

            const headerCard = new HeaderCard(
                { entity_id: entities.map((entity) => entity.entity_id) },
                {
                    ...Registry.strategyOptions.domains['_'],
                    ...Registry.strategyOptions.domains[domain],
                }
            ).createCard();

            try {
                const DomainCard = (await import(`../cards/${moduleName}`)).default;

                if (domain === 'sensor') {
                    let domainCardsPromises = entities
                        // .filter((entity) => Registry.hassStates[entity.entity_id]?.attributes.unit_of_measurement)
                        .map(async (entity) => {
                            const state = Registry.hassStates[entity.entity_id];
                            const device_class = state?.attributes.device_class;
                            if (device_class == null || device_class == 'enum') {
                                return new SensorCard(entity, {icon: undefined} as EntityCardConfig).getCard();    
                            }
                            const options = {
                                ...(entity.device_id && Registry.strategyOptions.card_options?.[entity.device_id]),
                                ...Registry.strategyOptions.card_options?.[entity.entity_id],
                                type: 'custom:mini-graph-card',
                                entities: [entity.entity_id],
                                icon: await entityIcon(Registry.config.hass, state, state?.state),
                            };
                            return new SensorCard(entity, options).getCard();
                        });
                    let domainCards = await Promise.all(domainCardsPromises);
                    if (domainCards.length) {
                        domainCards = stackHorizontal(
                            domainCards,
                            Registry.strategyOptions.domains[domain].stack_count ?? Registry.strategyOptions.domains['_'].stack_count
                        );

                        return { type: 'vertical-stack', cards: [headerCard, ...domainCards] };
                    }

                    return null;
                }

                let domainCards = entities.map((entity) => {
                    const cardOptions = {
                        ...(entity.device_id && Registry.strategyOptions.card_options?.[entity.device_id]),
                        ...Registry.strategyOptions.card_options?.[entity.entity_id],
                    };
                    return new DomainCard(entity, cardOptions).getCard();
                });

                domainCards = stackHorizontal(
                    domainCards,
                    Registry.strategyOptions.domains[domain].stack_count ?? Registry.strategyOptions.domains['_'].stack_count
                );

                return domainCards.length ? { type: 'vertical-stack', cards: [headerCard, ...domainCards] } : null;
            } catch (e) {
                logMessage(lvlError, `Error creating card configurations for domain ${domain}`, e);
                return null;
            }
        });

        // Await all domain card stacks
        const domainCardStacks = (await Promise.all(domainCardPromises)).filter(Boolean) as LovelaceCardConfig[];
        viewCards.push(...domainCardStacks);

        // Miscellaneous domain
        if (!Registry.strategyOptions.domains.default.hidden) {
            const miscellaneousEntities = new RegistryFilter(areaEntities)
                .not()
                .where((entity) => isSupportedDomain(entity.entity_id.split('.', 1)[0]))
                .toList();

            if (miscellaneousEntities.length) {
                try {
                    const MiscellaneousCard = (await import('../cards/MiscellaneousCard')).default;
                    let miscellaneousCards = miscellaneousEntities.map((entity) =>
                        new MiscellaneousCard(entity, Registry.strategyOptions.card_options?.[entity.entity_id]).getCard()
                    );

                    const headerCard = new HeaderCard(target, {
                        ...Registry.strategyOptions.domains['_'],
                        ...Registry.strategyOptions.domains['default'],
                    }).createCard();

                    if (miscellaneousCards.length) {
                        miscellaneousCards = stackHorizontal(
                            miscellaneousCards,
                            Registry.strategyOptions.domains['default'].stack_count ??
                            Registry.strategyOptions.domains['_'].stack_count
                        );

                        viewCards.push({
                            type: 'vertical-stack',
                            cards: [headerCard, ...miscellaneousCards],
                        });
                    }
                } catch (e) {
                    logMessage(lvlError, 'Error creating card configurations for domain `miscellaneous`', e);
                }
            }
        }
        console.log(viewCards)
        return viewCards;
    }

}
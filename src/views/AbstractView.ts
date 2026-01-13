import { HassEntity, HassServiceTarget } from 'home-assistant-js-websocket';
import HeaderCard from '../cards/HeaderCard';
import { Registry } from '../Registry';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import { LovelaceViewConfig } from '../types/homeassistant/data/lovelace/config/view';
import { StackCardConfig } from '../types/homeassistant/panels/lovelace/cards/types';
import { AbstractCardConfig, CustomHeaderCardConfig, StrategyHeaderCardConfig } from '../types/strategy/strategy-cards';
import { CustomCardConfig, SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig, ViewConstructor } from '../types/strategy/strategy-views';
import { sanitizeClassName } from '../utilities/auxiliaries';
import { logMessage, lvlFatal } from '../utilities/debug';
import RegistryFilter from '../utilities/RegistryFilter';
import { stackHorizontal } from '../utilities/cardStacking';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';

/**
 * Abstract View Class.
 *
 * To create a view configuration, this class should be extended by a child class.
 * Child classes should override the default configuration so the view correctly reflects the entities of a domain.
 *
 * @remarks
 * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
 */
abstract class AbstractView {
  /** The base configuration of a view. */
  protected baseConfiguration: ViewConfig = {
    icon: 'mdi:view-dashboard',
    subview: false,
  };

  /** A card configuration to control all entities in the view. */
  private viewHeaderCardConfiguration: StackCardConfig = {
    cards: [],
    type: '',
  };

  /**
   * Class constructor.
   *
   * @remarks
   * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
   */
  protected constructor() {
    if (!Registry.initialized) {
      logMessage(lvlFatal, 'Registry is not initialized!');
    }
  }

  protected get domain(): SupportedDomains | 'home' {
    return (this.constructor as unknown as ViewConstructor).domain;
  }

  protected domains(): Record<string, boolean | string[]> {
    return {}
  }

  /**
   * Get a view configuration.
   *
   * The configuration includes the card configurations which are created by createCardConfigurations().
   */
  async getView(): Promise<LovelaceViewConfig> {
    return {
      ...this.baseConfiguration,
      type: 'masonry',
      cards: await this.createCardConfigurations(),
    };
  }

  protected isInThisDomain(entity: EntityRegistryEntry): boolean {
    const prefix = this.domain + '.';
    const entity_id = entity.entity_id ?? ""
    if (entity_id.startsWith(prefix)) {
      return true;
    }
    const domains = this.domains()
    for (const domain of Object.keys(domains)) {
      const domainConfig = domains[domain]
      if (typeof domainConfig === 'boolean' && domainConfig) {
        if (entity_id.startsWith(domain + '.')) {
          return true;
        }
      }
      if (Array.isArray(domainConfig)) {
        if (entity_id.startsWith(domain + '.')) {
          const state = Registry.hassStates[entity.entity_id]
          const deviceClass = state.attributes.device_class
          if (deviceClass && domainConfig.includes(deviceClass)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  protected showHeader(): boolean {
    return false
  }

  /**
   * Create the configuration of the cards to include in the view.
   */
  protected async createCardConfigurations(): Promise<LovelaceCardConfig[]> {
    const viewCards: LovelaceCardConfig[] = [];
    const domainEntities = new RegistryFilter(Registry.entities)
      .where(e => this.isInThisDomain(e))
      .where((entity) => !entity.entity_id.endsWith('_stateful_scene'))
      .toList();

    // Create card configurations for each area.
    let index = 0
    for (const area of Registry.areas) {
      const areaEntities = new RegistryFilter(domainEntities).whereAreaId(area.area_id).toList()
      if (areaEntities.length > 0) {
        const info = await this.createAreaCards(area, areaEntities, index)
        index = index + 1
        if (info) {
          viewCards.push(...info);
        }
      }
    }

    // Add a Header Card to control all the entities in the view.
    if (this.showHeader() && this.viewHeaderCardConfiguration.cards.length && viewCards.length) {
      viewCards.unshift(this.viewHeaderCardConfiguration);
    }

    return viewCards;
  }

  protected async _createAreaCards(area: { area_id: string, name: string }, domainEntities: EntityRegistryEntry[], showHeader: boolean = true) {
    let areaCards: AbstractCardConfig[] = [];

    // Set the target of the Header card to the current area.
    let target: HassServiceTarget = {
      area_id: [area.area_id],
    };
    const areaEntities = domainEntities

    // Set the target of the Header card to entities without an area.
    if (area.area_id === 'undisclosed') {
      target = {
        entity_id: areaEntities.map((entity) => entity.entity_id),
      };
    }

    // Create a card configuration for each entity in the current area.
    for (const entity of areaEntities) {
      const card = await this.createCard(entity)
      areaCards.push(card)
    }

    // Stack the cards of the current area.
    if (areaCards.length) {
      areaCards = stackHorizontal(
        areaCards,
        Registry.strategyOptions.domains[this.domain as SupportedDomains]?.stack_count ??
        Registry.strategyOptions.domains['_'].stack_count
      );

      // Create and insert a Header card.
      const areaHeaderCardOptions = (
        'headerCardConfiguration' in this.baseConfiguration ? this.baseConfiguration.headerCardConfiguration : {}
      ) as CustomHeaderCardConfig;
      if (showHeader) {
        const header = new HeaderCard(target, { title: area.name, ...areaHeaderCardOptions }).createCard()
        areaCards.unshift(header)
      }
      const content: LovelaceCardConfig = { type: 'vertical-stack', cards: areaCards }
      return [content]
    }
    return null
  }

  protected async createAreaCards(area: { area_id: string, name: string }, domainEntities: EntityRegistryEntry[], index: number) {
    if (area.area_id === 'undisclosed' && domainEntities.length > 10) {
      const itemCount = Math.floor(domainEntities.length / 3)
      const length = domainEntities.length
      const one = await this._createAreaCards(area, domainEntities.slice(0, length - itemCount * 2), true) ?? []
      const two = await this._createAreaCards(area, domainEntities.slice(length - itemCount * 2, length - itemCount), index > 0) ?? []
      const three = await this._createAreaCards(area, domainEntities.slice(length - itemCount), index > 0) ?? []
      return [...one, ...two, ...three]
    }
    return await this._createAreaCards(area, domainEntities)
  }

  protected async createCard(entity: EntityRegistryEntry) {
    const domain = entity.entity_id.split('.')[0]
    const moduleName = sanitizeClassName(domain + 'Card');
    const DomainCard = (await import(`../cards/${moduleName}`)).default;
    const card = new DomainCard(entity, this.getCustomCardConfig(entity)).getCard()
    return card
  }

  /**
   * Initialize the view configuration with defaults and custom settings.
   *
   * @param viewConfiguration The view's default configuration for the view.
   * @param customConfiguration The view's custom configuration to apply.
   * @param headerCardConfig The view's Header card configuration.
   */
  protected initializeViewConfig(
    viewConfiguration: ViewConfig,
    customConfiguration: ViewConfig = {},
    headerCardConfig: CustomHeaderCardConfig
  ): void {
    this.baseConfiguration = { ...this.baseConfiguration, ...viewConfiguration, ...customConfiguration };

    this.baseConfiguration.headerCardConfiguration = {
      ...this.baseConfiguration.headerCardConfiguration,
      showControls:
        Registry.strategyOptions.domains[this.domain as Exclude<SupportedDomains, 'home'>]?.showControls ??
        Registry.strategyOptions.domains['_'].showControls,
    };

    this.viewHeaderCardConfiguration = new HeaderCard(this.getDomainTargets(), {
      ...(this.baseConfiguration.headerCardConfiguration as StrategyHeaderCardConfig),
      ...headerCardConfig,
    }).createCard();
  }

  /**
   * Get the domain's entity ids to target for a HASS service call.
   */
  private getDomainTargets(): HassServiceTarget {
    return {
      entity_id: Registry.entities
        .filter((entity) => entity.entity_id.startsWith(this.domain + '.'))
        .map((entity) => entity.entity_id),
    };
  }

  protected getCustomCardConfig(entity: EntityRegistryEntry): CustomCardConfig | undefined {
    const sg = Registry.strategyOptions.card_options?.[entity.entity_id];
    return sg
  }

}

export default AbstractView;

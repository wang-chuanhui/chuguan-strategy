// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import CameraCard from '../cards/CameraCard';
import HeaderCard from '../cards/HeaderCard';
import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';

/**
 * Camera View Class.
 *
 * Used to create a view configuration for entities of the camera domain.
 */
class CameraView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain: SupportedDomains = 'camera' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    return {
      title: localize('camera.cameras'),
      path: 'cameras',
      icon: 'mdi:cctv',
      subview: false,
      headerCardConfiguration: {
        showControls: false, // FIXME: This should be named "show_controls". Also in other files and Wiki.
      },
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('camera.all_cameras'),
      subtitle:
        `${Registry.getCountTemplate(CameraView.domain, 'ne', 'off')} ${localize('camera.cameras')} ` +
        localize('generic.busy'),
    };
  }

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(CameraView.getDefaultConfig(), customConfiguration, CameraView.getViewHeaderCardConfig());
  }

  protected async createAreaCards(area: { area_id: string; name: string; }, domainEntities: EntityRegistryEntry[], index: number): Promise<LovelaceCardConfig[] | null> {
    const cards = domainEntities.map(item => {
      return new CameraCard(item, this.getCustomCardConfig(item) as any).getCard()
    })
    if (cards.length > 0) {
      const header = new HeaderCard({}, { title: area.name }).createCard()
      cards.unshift(header)
    }
    return cards
  }
}

export default CameraView;

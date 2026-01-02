// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { CoverCardConfig } from '../types/lovelace-mushroom/cards/cover-card-config';
import { RegistryEntry } from '../types/strategy/strategy-generics';
import AbstractCard from './AbstractCard';

/**
 * Cover Card Class
 *
 * Used to create a card configuration to control an entity of the cover domain.
 */
class CoverCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): CoverCardConfig {
    return {
      type: 'custom:mushroom-cover-card',
      icon: undefined,
      layout: 'horizontal',
      show_buttons_control: true,
      show_position_control: true,
      show_tilt_position_control: true,
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CoverCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: CoverCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...CoverCard.getDefaultConfig(), ...this.getSubClassCustomCardConfig(entity), ...customConfiguration };
  }
  is_card_active(entity: RegistryEntry) {
    return this.is_generic_card_active(entity, '!=', 'closed')
  }
  protected getSubClassCustomCardConfig(entity: EntityRegistryEntry): CoverCardConfig | null | undefined {
      const state = Registry.hassStates[entity.entity_id];
      if (!state) {
        return null
      }
      const supported_features =  state.attributes.supported_features
      if (!supported_features) {
        return null
      }
      const hasPosition = (supported_features & 4) !== 0
      const hasTilt = (supported_features & 128) !== 0
      return {
        show_buttons_control: true, 
        show_position_control: hasPosition,
        show_tilt_position_control: hasTilt
      } as CoverCardConfig
    }
}

export default CoverCard;

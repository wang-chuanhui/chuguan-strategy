// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { ClimateCardConfig } from '../types/lovelace-mushroom/cards/climate-card-config';
import { RegistryEntry } from '../types/strategy/strategy-generics';
import AbstractCard from './AbstractCard';

/**
 * Climate Card Class
 *
 * Used to create a card configuration to control an entity of the climate domain.
 */
class ClimateCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): ClimateCardConfig {
    return {
      type: 'custom:mushroom-climate-card',
      icon: undefined,
      layout: 'horizontal',
      hvac_modes: ['off', 'cool', 'heat', 'fan_only'],
      show_temperature_control: true,
      collapsible_controls: true,
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {ClimateCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: ClimateCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...ClimateCard.getDefaultConfig(), ...this.getSubClassCustomCardConfig(entity), ...customConfiguration };
  }
  is_card_active(entity: RegistryEntry) {
    return this.is_generic_card_active(entity, '!=', 'off')
  }
  protected getSubClassCustomCardConfig(entity: EntityRegistryEntry): ClimateCardConfig | null | undefined {
    const state = Registry.hassStates[entity.entity_id];
    if (!state) {
      return null
    }
    const hvac_modes = state.attributes['hvac_modes']
    if (!hvac_modes) {
      return null
    }
    return {
      hvac_modes,
    } as ClimateCardConfig
  }
}

export default ClimateCard;

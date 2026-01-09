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

  hasOpen = true
  hasPosition = true
  hasTilt = true

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CoverCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: CoverCardConfig) {
    super(entity);
    this.setupFeatures(entity)
    this.configuration = { ...this.configuration, ...CoverCard.getDefaultConfig(), ...this.getSubClassCustomCardConfig(entity), ...customConfiguration };
    if (this.hasOpen == false) {
      this.configuration.tap_action = { action: 'none' }
    }
  }
  is_card_active(entity: EntityRegistryEntry) {
    if (this.hasOpen == false) {
      return null;
    }
    return this.is_generic_card_active(entity, '!=', 'closed')
  }
  protected getSubClassCustomCardConfig(entity: EntityRegistryEntry): CoverCardConfig | null | undefined {
    return {
      show_buttons_control: this.hasOpen,
      show_position_control: this.hasPosition,
      show_tilt_position_control: this.hasTilt
    } as CoverCardConfig
  }

  private setupFeatures(entity: EntityRegistryEntry) {
    const state = Registry.hassStates[entity.entity_id];
    if (!state) {
      return
    }
    const supported_features = state.attributes.supported_features
    if (!supported_features) {
      return
    }
    this.hasOpen = (supported_features & 1) !== 0
    this.hasPosition = (supported_features & 4) !== 0
    this.hasTilt = (supported_features & 128) !== 0
  }
}

export default CoverCard;

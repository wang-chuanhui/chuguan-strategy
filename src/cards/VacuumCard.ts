// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { HassEntity } from 'home-assistant-js-websocket';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { VACUUM_COMMANDS, VacuumCardConfig } from '../types/lovelace-mushroom/cards/vacuum-card-config';
import AbstractCard from './AbstractCard';
import { RegistryEntry } from '../types/strategy/strategy-generics';

/**
 * Vacuum Card Class
 *
 * Used to create a card configuration to control an entity of the vacuum domain.
 */
class VacuumCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): VacuumCardConfig {
    return {
      type: 'custom:mushroom-vacuum-card',
      icon: undefined,
      icon_animation: true,
      layout: 'horizontal',
      commands: [...VACUUM_COMMANDS],
      tap_action: {
        action: 'more-info',
      },
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {VacuumCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: VacuumCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...VacuumCard.getDefaultConfig(), ...customConfiguration };
  }

  is_card_active(entity: RegistryEntry) {
    return this.is_generic_card_active(entity, 'in', '["cleaning", "returning", "paused"]')
  }
}

export default VacuumCard;

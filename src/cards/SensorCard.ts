import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { entityIcon } from '../types/homeassistant/data/icons';
import { EntityCardConfig } from '../types/lovelace-mushroom/cards/entity-card-config';
import AbstractCard from './AbstractCard';

/**
 * Sensor Card Class
 *
 * Used to create a card for controlling an entity of the sensor domain.
 */
class SensorCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): EntityCardConfig {
    return {
      type: 'custom:mushroom-entity-card',
      icon: undefined,
      animate: true,
      // line_color: 'green',
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {EntityCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: EntityCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...SensorCard.getDefaultConfig(), ...customConfiguration };
  }

  static async createCard(entity: EntityRegistryEntry) {
    const state = Registry.hassStates[entity.entity_id];
    const device_class = state?.attributes.device_class;
    if (device_class == null || device_class == 'enum') {
      return new SensorCard(entity, { icon: undefined } as EntityCardConfig).getCard();
    }
    const options = {
      ...(entity.device_id && Registry.strategyOptions.card_options?.[entity.device_id]),
      ...Registry.strategyOptions.card_options?.[entity.entity_id],
      type: 'custom:mini-graph-card',
      entities: [entity.entity_id],
      icon: await entityIcon(Registry.config.hass, state, state?.state),
    };
    return new SensorCard(entity, options).getCard();
  }
}

export default SensorCard;

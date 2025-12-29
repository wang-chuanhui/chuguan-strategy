import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { EntityCardConfig } from '../types/lovelace-mushroom/cards/entity-card-config';
import { isCallServiceActionConfig } from '../types/strategy/strategy-generics';
import AbstractCard from './AbstractCard';

/**
 * Button Card Class
 *
 * Used to create a card configuration to control an entity of button domain.
 */
class ButtonCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): EntityCardConfig {
    return {
      type: 'custom:mushroom-entity-card',
      tap_action: {
        action: 'perform-action',
        perform_action: 'button.press', 
        target: {
          entity_id: undefined
        }
      }
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

    const configuration = ButtonCard.getDefaultConfig()
    if (isCallServiceActionConfig(configuration.tap_action)) {
      configuration.tap_action.target = {
        entity_id: entity.entity_id
      }
    }
    configuration.icon = Registry.hassStates[entity.entity_id]?.attributes.icon ?? configuration.icon;

    this.configuration = { ...this.configuration, ...configuration, ...customConfiguration };
  }
}

export default ButtonCard;

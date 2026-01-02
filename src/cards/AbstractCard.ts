import { Registry } from '../Registry';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import { AbstractCardConfig } from '../types/strategy/strategy-cards';
import { RegistryEntry } from '../types/strategy/strategy-generics';
import { logMessage, lvlFatal } from '../utilities/debug';

/**
 * Abstract Card Class
 *
 * To create a card configuration, this class should be extended by a child class.
 * Child classes should override the default configuration so the card correctly reflects the entity.
 *
 * @remarks
 * Before using this class, the Registry module must be initialized by calling {@link Registry.initialize}.
 */
abstract class AbstractCard {
  /** The registry entry this card represents. */
  readonly entity: RegistryEntry;

  /**
   * The card configuration for this entity.
   *
   * Child classes should override this property to reflect their own card type and options.
   */
  protected configuration: LovelaceCardConfig = {
    type: 'custom:mushroom-entity-card',
    icon: 'mdi:help-circle',
  };

  /**
   * Class constructor.
   *
   * @param {RegistryEntry} entity The registry entry to create a card configuration for.
   *
   * @remarks
   * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
   */
  protected constructor(entity: RegistryEntry) {
    if (!Registry.initialized) {
      logMessage(lvlFatal, 'Registry not initialized!');
    }

    this.entity = entity;
  }

  /**
   * Get a card configuration.
   *
   * The configuration should be set by any of the child classes so the card correctly reflects an entity.
   */
  getCard(): AbstractCardConfig {
    return {
      card_mod: this.is_card_active(this.entity),
      ...this.configuration,
      entity: 'entity_id' in this.entity ? this.entity.entity_id : undefined,
    };
  }

  is_card_active(entity: RegistryEntry): any {
    return null
  }

  is_generic_card_active(entity: RegistryEntry, cmp = '==', state = 'on', ha_card_extra = '') {
    // console.info('IS CARD ACTIVE', entity.entity_id, cmp, state)
    const style = {
      '.': `ha-card {
                  background-color: {{ 'white'
                                       if states(config.entity)${cmp}'${state}' else
                                       'rgba(50, 50, 50, 0.4)' }};
                  backdrop-filter: blur(20px);
                  -webkit-backdrop-filter: blur(20px);
                }${ha_card_extra}`,
      'mushroom-state-info$': `.container { {{
                                     '--card-primary-color: black;
                                      --card-secondary-color: grey;'
                                       if states(config.entity)${cmp}'${state}' else
                                     '--card-primary-color: white;
                                      --card-secondary-color: lightgrey;'
                                   }} }`
    }

    return {
      style: style
    }
  }
}

export default AbstractCard;

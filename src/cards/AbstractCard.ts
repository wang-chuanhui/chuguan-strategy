import { HassEntity } from 'home-assistant-js-websocket';
import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
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
    // const style = {
    //   '.': `ha-card {
    //               background-color: {{ 'var(--primary-background-color)'
    //                                    if states(config.entity)${cmp}'${state}' else
    //                                    'rgba(var(--rgb-primary-text-color), 0.4)' }};
    //               backdrop-filter: blur(20px);
    //               -webkit-backdrop-filter: blur(20px);
    //             }${ha_card_extra}`,
      // 'mushroom-state-info$': `.container { {{
      //                                '--card-primary-color: black;
      //                                 --card-secondary-color: grey;'
      //                                  if states(config.entity)${cmp}'${state}' else
      //                                '--card-primary-color: white;
      //                                 --card-secondary-color: lightgrey;'
      //                              }} }`
    // }

    // rgb(from var(--my-card-bg-active) calc(255 - r) calc(255 - g) calc(255 - b) / 0.3) 
    // rgba(0, 0, 0, 0.3)
    const style = {
  '.': `

  :host {
      --my-card-bg-active: rgb(var(--rgb-card-background-color));
      --my-card-bg-inactive: rgb(from var(--my-card-bg-active) calc(255 - r) calc(255 - g) calc(255 - b) / 0.3);
      --my-text-active: rgb(var(--rgb-primary-text-color));
      --my-text-inactive: rgb(from var(--my-text-active) calc(255 - r) calc(255 - g) calc(255 - b));
      --my-boarder-active: rgb(from var(--my-card-bg-active) calc(255 - r) calc(255 - g) calc(255 - b) / 0.1);
      --my-boarder-inactive: rgb(var(--rgb-card-background-color), 0.1);
      }

    ha-card {

      /* 3. 应用逻辑 */
      background-color: {{ 
        'var(--my-card-bg-active)' if states(config.entity)${cmp}'${state}' 
        else 'var(--my-card-bg-inactive)' 
      }};
      
      color: {{ 
        'var(--my-text-active)' if states(config.entity)${cmp}'${state}' 
        else 'var(--my-text-inactive)' 
      }};

      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: {{ 
        '1px solid var(--my-boarder-active)' if states(config.entity)${cmp}'${state}' 
        else '1px solid var(--my-boarder-inactive)' 
      }};
      transition: all 0.3s ease; /* 增加平滑过渡效果 */
    }
  `, 
       'mushroom-state-info$': `.container { {{
                                     '--card-primary-color: var(--my-text-active);
                                      --card-secondary-color: var(--my-text-active);'
                                       if states(config.entity)${cmp}'${state}' else
                                     '--card-primary-color: var(--my-text-inactive);
                                      --card-secondary-color: var(--my-text-inactive);'
                                   }} }`
}

    return {
      style: style
    }
  }

  setupFeatures(entity: EntityRegistryEntry) {
    const state = Registry.hassStates[entity.entity_id];
    if (!state) {
      return
    }
    this.setupFeaturesState(entity, state);
    const supported_features = state.attributes.supported_features
    if (!supported_features) {
      return
    }
    this.setupFeaturesSupported(entity, supported_features);
  }

  setupFeaturesState(entity: EntityRegistryEntry, state: HassEntity) {

  }

  setupFeaturesSupported(entity: EntityRegistryEntry, supported_features: number) {

  }

}

export default AbstractCard;

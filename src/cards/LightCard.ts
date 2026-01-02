// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { LightCardConfig } from '../types/lovelace-mushroom/cards/light-card-config';
import { isCallServiceActionConfig, RegistryEntry } from '../types/strategy/strategy-generics';
import AbstractCard from './AbstractCard';

/**
 * Light Card Class
 *
 * Used to create a card configuration to control an entity of the light domain.
 */
class LightCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): LightCardConfig {
    return {
      type: 'custom:mushroom-light-card',
      icon: undefined,
      layout: 'horizontal',
      show_brightness_control: true,
      show_color_control: true,
      show_color_temp_control: true,
      use_light_color: true,
      double_tap_action: {
        action: 'call-service',
        perform_action: 'light.turn_on',
        target: {
          entity_id: undefined,
        },
        data: {
          rgb_color: [255, 255, 255],
        },
      },
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {LightCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: LightCardConfig) {
    super(entity);

    const configuration = LightCard.getDefaultConfig();

    if (isCallServiceActionConfig(configuration.double_tap_action)) {
      configuration.double_tap_action.target = { entity_id: entity.entity_id };
    }

    this.configuration = { ...this.configuration, ...configuration, ...this.getSubClassCustomCardConfig(entity), ...customConfiguration };
  }

  is_card_active(entity: RegistryEntry) {
    return this.is_generic_card_active(entity)
  }
  protected getSubClassCustomCardConfig(entity: EntityRegistryEntry): LightCardConfig | null | undefined {
    const state = Registry.hassStates[entity.entity_id];
    if (!state) {
      return null
    }
     const supportedColorModes = state.attributes['supported_color_modes']
    if (Array.isArray(supportedColorModes)) {
      let onoff = false, brightness = false, color_temp = false, color = false,
          scm = supportedColorModes[0]
          onoff = scm == 'onoff'
          brightness = [ 'brightness', 'color_temp', 'hs', 'xy',
                          'rgb', 'rgbw', 'rgbww' ].includes(scm)
          color_temp = scm == 'color_temp'
          color = [ 'hs', 'xy', 'rgb', 'rgbw', 'rgbww' ].includes(scm)
          return {
            show_brightness_control: brightness,
            show_color_temp_control: color_temp,
            show_color_control: color,
            layout: 'horizontal',
            stack_count: (brightness || color || color_temp) ? 2 : 1,
          } as LightCardConfig
    }
    return null;
  }
}

export default LightCard;

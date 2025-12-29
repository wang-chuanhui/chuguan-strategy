// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { is, string } from 'superstruct';
import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { LightCardConfig } from '../types/lovelace-mushroom/cards/light-card-config';
import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';

/**
 * Light View Class.
 *
 * Used to create a view for entities of the light domain.
 *
 * @class LightView
 * @extends AbstractView
 */
class LightView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain = 'light' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    return {
      title: localize('light.lights'),
      path: 'lights',
      icon: 'mdi:lightbulb-group',
      subview: false,
      headerCardConfiguration: {
        iconOn: 'mdi:lightbulb',
        iconOff: 'mdi:lightbulb-off',
        onService: 'light.turn_on',
        offService: 'light.turn_off',
      },
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('light.all_lights'),
      subtitle:
        `${Registry.getCountTemplate(LightView.domain, 'eq', 'on')} ${localize('light.lights')} ` +
        localize('generic.on'),
    };
  }

  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(LightView.getDefaultConfig(), customConfiguration, LightView.getViewHeaderCardConfig());
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
            layout: onoff ? 'default' : 'horizontal',
          } as LightCardConfig
    }
    return null;
  }
}

export default LightView;

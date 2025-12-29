// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';

/**
 * Button View Class.
 *
 * Used to create a view configuration for entities of the button domain.
 */
class ButtonView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain = 'button' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    return {
      title: localize('button.buttons'),
      path: 'buttons',
      icon: 'mdi:button-pointer',
      subview: false,
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('button.all_buttons'),
    };
  }

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(ButtonView.getDefaultConfig(), customConfiguration, ButtonView.getViewHeaderCardConfig());
  }
}

export default ButtonView;

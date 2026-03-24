// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { PictureEntityCardConfig } from '../types/homeassistant/panels/lovelace/cards/types';
import AbstractCard from './AbstractCard';

/**
 * Camera Card Class
 *
 * Used to create a card configuration to control an entity of the camera domain.
 */
class CameraCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): PictureEntityCardConfig {
    return {
      entity: '',
      type: 'picture-entity',
      show_name: true,
      show_state: true,
      camera_view: 'auto',
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {PictureEntityCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: PictureEntityCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...CameraCard.getDefaultConfig(), ...customConfiguration };
    if (customElements.get('webrtc-camera') || true) {
      const state = Registry.hassStates[entity.entity_id];
      console.log(entity, state, state.attributes.ptz)
      this.configuration.type = 'custom:webrtc-camera';
      this.configuration.entity = entity.entity_id;
      this.configuration.title = state.attributes.friendly_name || entity.original_name;
      this.configuration.mode = 'webrtc'
      if (state.attributes.entity_picture) {
        this.configuration.poster = window.location.origin + state.attributes.entity_picture;
      }
      if (state.attributes.ptz) {
        this.configuration.ptz = state.attributes.ptz;
      }
    }
  }
}

export default CameraCard;

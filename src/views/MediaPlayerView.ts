import { CustomHeaderCardConfig } from "../types/strategy/strategy-cards";
import { ViewConfig } from "../types/strategy/strategy-views";
import { localize } from "../utilities/localize";
import AbstractView from "./AbstractView";


export default class MediaPlayerView extends AbstractView {
  static readonly domain = 'media_player' as const;
  static getDefaultConfig(): ViewConfig {
    return {
        title: localize('media_player.media_players'),
        path: 'media_player', 
        icon: 'mdi:cast-connected', 
        subview: false
    }
  }
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {

    }
  }

    constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(MediaPlayerView.getDefaultConfig(), customConfiguration, MediaPlayerView.getViewHeaderCardConfig());
  }

}
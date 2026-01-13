import { CustomHeaderCardConfig } from "../types/strategy/strategy-cards";
import { ViewConfig } from "../types/strategy/strategy-views";
import { localize } from "../utilities/localize";
import AbstractView from "./AbstractView";


export default class WaterHeaterView extends AbstractView {
  static readonly domain = 'water_heater' as const;
  static getDefaultConfig(): ViewConfig {
    return {
        title: localize('water_heater.water_heaters'),
        path: 'water_heater', 
        icon: 'mdi:water-boiler', 
        subview: false
    }
  }
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {

    }
  }

    constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(WaterHeaterView.getDefaultConfig(), customConfiguration, WaterHeaterView.getViewHeaderCardConfig());
  }

}
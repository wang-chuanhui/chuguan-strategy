import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { ClockCardConfig, TimeFormat } from "../types/homeassistant/panels/lovelace/cards/types";
import AbstractCard from "./AbstractCard";


export default class ClockCard extends AbstractCard {

    static getDefaultCardConfig(): ClockCardConfig {
        return {
            type: 'custom:chuguan-clock-card',
            clock_style: 'digital', 
            clock_size: 'medium', 
            show_seconds: true, 
            seconds_motion: 'tick', 
            time_format: TimeFormat.twenty_four, 
            no_background: true,
            border: false, 
            ticks: 'minute', 
            face_style: 'markers'
        }
    }

    constructor(entity: EntityRegistryEntry, customConfiguration: Partial<ClockCardConfig>) {
        super(entity);

        this.configuration = {
            ...this.configuration, 
            ...ClockCard.getDefaultCardConfig(), 
            ...customConfiguration
        }
    }

}
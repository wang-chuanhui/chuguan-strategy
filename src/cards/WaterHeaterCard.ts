import { TileCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import TileCard from "./TileCard"


export default class WaterHeaterCard extends TileCard {
static getDefaultConfig(): TileCardConfig {
        return {
            type: 'tile',
            icon: undefined,
            line_color: undefined, 
            entity: '', 
             state_content: ['state', 'temperature']
        };
    }
}

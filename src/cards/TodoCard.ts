import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { TodoListCardConfig } from "../types/homeassistant/panels/lovelace/cards/types";
import AbstractCard from "./AbstractCard";


export default class TodoCard extends AbstractCard {

    static getDefaultCardConfig() {
        return {
            type: "todo-list",
            entity: undefined,
            hide_completed: true,
            hide_create: false, 
            hide_section_headers: false
        }
    }

    constructor(entity: EntityRegistryEntry, customConfiguration?: TodoListCardConfig) {
        super(entity);
        this.configuration = {
            ...this.configuration,
            ...TodoCard.getDefaultCardConfig(),
            title: entity.original_name,
            ...customConfiguration
        }
    }

}
import TileCard from "../cards/TileCard";
import { Registry } from "../Registry";
import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import { StackCardConfig } from "../types/homeassistant/panels/lovelace/cards/types";
import { CustomCardConfig } from "../types/strategy/strategy-generics";
import { sanitizeClassName } from '../utilities/auxiliaries';
import { stackHorizontal } from "../utilities/cardStacking";
import { localize } from '../utilities/localize';
import './header'


function getCustomCardConfig(entity: EntityRegistryEntry): CustomCardConfig | undefined {
    const sg = Registry.strategyOptions.card_options?.[entity.entity_id];
    return sg
}


export async function getFavoriteEntities() {
    const favoriteCards: LovelaceCardConfig[] = [];
    const favoriteEntityIds = Registry.strategyOptions.favorite_entities ?? []

    for (const entityId of favoriteEntityIds) {
        const entity = Registry.entities.find(e => e.entity_id === entityId);
        console.log(entityId, entity)
        if (!entity) {
            continue;
        }

        try {
            const domain = entityId.split('.')[0];
            const moduleName = sanitizeClassName(domain + 'Card');
            const DomainCard = (await import(`../cards/${moduleName}`)).default;

            const card = new DomainCard(entity, getCustomCardConfig(entity)).getCard();
            favoriteCards.push(card);
        } catch (e) {
            const card = new TileCard(entity, getCustomCardConfig(entity) as StackCardConfig).getCard()
            favoriteCards.push(card);
        }
    }

    const cards: LovelaceCardConfig[] = [
        {
            type: 'custom:chuguan-favorite-header',
            title: localize('generic.favorites'),
        } as any,
    ];
    cards.push(...stackHorizontal(favoriteCards, Registry.strategyOptions.home_view.stack_count['_']));
    cards.push({
        type: 'custom:mushroom-template-card',
        primary: '暂无收藏实体',
        secondary: '点击右上角按钮添加收藏',
        icon: 'mdi:star-outline',
        icon_color: 'grey',
    });

    return [{
        type: 'vertical-stack',
        cards: cards,
    }];
}
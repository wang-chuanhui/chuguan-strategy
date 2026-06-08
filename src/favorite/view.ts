import SensorCard from "../cards/SensorCard";
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


export async function getFavoriteEntities(key: string = 'favorite_entities', title: string = localize('generic.favorites')) {
    const favoriteCards: LovelaceCardConfig[] = [];
    const favoriteEntityIds = Registry.strategyOptions[key] ?? []
    console.log(key, favoriteEntityIds)
    for (const entityId of favoriteEntityIds) {
        const entity = Registry.entities.find(e => e.entity_id === entityId);

        if (!entity) {
            continue;
        }

        try {
            const domain = entityId.split('.')[0];
            if (domain == 'sensor') {
                const card = await SensorCard.createCard(entity);
                favoriteCards.push(card);
                continue;
            }
            const moduleName = sanitizeClassName(domain + 'Card');
            const DomainCard = (await import(`../cards/${moduleName}`)).default;

            const card = new DomainCard(entity, getCustomCardConfig(entity)).getCard();
            favoriteCards.push(card);
        } catch (e) {
            console.error(e);
            const card = new TileCard(entity, getCustomCardConfig(entity) as StackCardConfig).getCard()
            favoriteCards.push(card);
        }
    }

    const cards: LovelaceCardConfig[] = [
        {
            type: 'custom:chuguan-favorite-header',
            title: title,
            key: key,
        } as any,
    ];
    cards.push(...stackHorizontal(favoriteCards, 2));
    // cards.push({
    //     type: 'custom:mushroom-template-card',
    //     primary: '暂无收藏实体',
    //     secondary: '点击右上角按钮添加收藏',
    //     icon: 'mdi:star-outline',
    //     icon_color: 'grey',
    // });

    return [{
        type: 'vertical-stack',
        cards: cards,
    }];
}

export async function getAllFavoriteEntities() {
    const keys = Object.keys(Registry.strategyOptions).filter(key => key.startsWith('favorite_entities'))
    const cards = await Promise.all(keys.map(key => {
        let title = localize('generic.favorites')
        if (key != 'favorite_entities') {
            if (key.startsWith('favorite_entities_')) {
                title = key.replace('favorite_entities_', '')
            }else if (key.startsWith('favorite_entities')) {
                title = key.replace('favorite_entities', '')
            }
        }
        if (title == '') {
            title = localize('generic.favorites')
        }
        return getFavoriteEntities(key, title)
    }))
    return cards
}
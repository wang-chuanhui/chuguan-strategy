import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';

export class FavoriteManager {
  /**
   * 检查实体是否已收藏
   */
  static isFavorite(entityId: string): boolean {
    const favorites = Registry.strategyOptions.favorite_entities || [];
    return favorites.includes(entityId);
  }

  /**
   * 添加实体到收藏
   */
  static async addToFavorites(entityId: string): Promise<void> {
    const currentFavorites = Registry.strategyOptions.favorite_entities || [];

    if (currentFavorites.includes(entityId)) {
      return;
    }

    const newFavorites = [...currentFavorites, entityId];
    await this.saveFavorites(newFavorites);
  }

  /**
   * 从收藏中移除实体
   */
  static async removeFromFavorites(entityId: string): Promise<void> {
    const currentFavorites = Registry.strategyOptions.favorite_entities || [];
    const newFavorites = currentFavorites.filter(id => id !== entityId);
    await this.saveFavorites(newFavorites);
  }

  /**
   * 切换实体的收藏状态
   */
  static async toggleFavorite(entityId: string): Promise<void> {
    if (this.isFavorite(entityId)) {
      await this.removeFromFavorites(entityId);
    } else {
      await this.addToFavorites(entityId);
    }
  }

  /**
   * 保存收藏列表到配置
   */
  private static async saveFavorites(favorites: string[]): Promise<void> {
    if (!Registry.config) {
      console.error('Config manager not initialized');
      return;
    }

    const config = Registry.config.options;
    config.favorite_entities = favorites;

    await Registry.config.saveConfig(config as any);
    window.dispatchEvent(new CustomEvent('location-changed', {
      bubbles: true,
      composed: true,
      detail: { replace: false }
    }));
  }

  /**
   * 获取所有收藏的实体
   */
  static getFavoriteEntities(): EntityRegistryEntry[] {
    const favoriteIds = Registry.strategyOptions.favorite_entities || [];
    return Registry.entities.filter(entity => favoriteIds.includes(entity.entity_id));
  }

  /**
   * 生成收藏卡片的操作配置
   */
  static getFavoriteActionConfig(entityId: string): any {
    return {
      action: 'fire-dom-event',
      detail: {
        event: 'cg_toggle_favorite',
        entity_id: entityId,
        is_favorite: this.isFavorite(entityId)
      }
    };
  }
}
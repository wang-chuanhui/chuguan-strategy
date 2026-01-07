import { HassServiceTarget } from 'home-assistant-js-websocket';
import HeaderCard from './cards/HeaderCard';
import SensorCard from './cards/SensorCard';
import { Registry } from './Registry';
import { LovelaceCardConfig } from './types/homeassistant/data/lovelace/config/card';
import { LovelaceConfig } from './types/homeassistant/data/lovelace/config/types';
import { LovelaceViewConfig } from './types/homeassistant/data/lovelace/config/view';
import {
  DashboardInfo,
  isSupportedDomain,
  isSupportedView,
  StrategyArea,
  StrategyViewConfig,
  ViewInfo,
} from './types/strategy/strategy-generics';
import { sanitizeClassName } from './utilities/auxiliaries';
import { logMessage, lvlError, lvlInfo } from './utilities/debug';
import RegistryFilter from './utilities/RegistryFilter';
import { stackHorizontal } from './utilities/cardStacking';
import { PersistentNotification } from './utilities/PersistentNotification';
import { HomeAssistant } from './types/homeassistant/types';
import semver from 'semver/preload';
import { NOTIFICATIONS } from './notifications';
import { gen_background } from './utilities/background';
import { subscribeEvnets } from './utilities/event';
import { AreaView } from './views/AreaView';
import SettingView from './pages/SettingView';
import './shared/EventButton';
import './shared/SortListCard';
/**
 * Based on mushroom-strategy (https://github.com/DigiLive/mushroom-strategy), Copyright (c) 2025 Ferry Cools, BSD-3-Clause
 */

class MushroomStrategy extends HTMLTemplateElement {
  /**
   * Generate a dashboard.
   *
   * This method creates views for each exposed domain and area.
   * It also adds custom views if specified in the strategy options.
   *
   * @param {DashboardInfo} info Dashboard strategy information object.
   *
   * @remarks
   * Called when opening a dashboard.
   */
  static async generateDashboard(info: DashboardInfo): Promise<LovelaceConfig> {
    await Registry.initialize(info);

    await MushroomStrategy.handleNotifications(info.hass);

    const views: StrategyViewConfig[] = [];

    // Parallelize view imports and creation.
    const viewPromises = Registry.getExposedNames('view')
      .filter(isSupportedView)
      .map(async (viewName) => {
        try {
          const moduleName = sanitizeClassName(`${viewName}View`);
          const View = (await import(`./views/${moduleName}`)).default;
          const currentView = new View(Registry.strategyOptions.views[viewName]);
          const viewConfiguration = await currentView.getView();

          if (viewConfiguration.cards.length) {
            viewConfiguration.background = gen_background(viewName);
            return viewConfiguration;
          }

          logMessage(lvlInfo, `View ${viewName} has no entities available!`);
        } catch (e) {
          logMessage(lvlError, `Error importing ${viewName} view!`, e);
        }

        return null;
      });

    const resolvedViews = (await Promise.all(viewPromises)).filter(Boolean) as StrategyViewConfig[];

    views.push(...resolvedViews);

    // Extra views
    if (Registry.strategyOptions.extra_views) {
      views.push(...Registry.strategyOptions.extra_views);

      views.sort((a, b) => {
        return (a.order ?? Infinity) - (b.order ?? Infinity) || (a.title ?? '').localeCompare(b.title ?? '');
      });
    }

    // Subviews for areas
    const orders = views.map(item => item.order ?? 0)
    const maxOrder = Math.max(...orders)
    const areas = Registry.areas.filter(area => {
      const areaEntities = new RegistryFilter(Registry.entities).whereAreaId(area.area_id).toList();
      return areaEntities.length > 0
    })
    views.push(
      ...areas.map((area, index) => (AreaView.getView(area, maxOrder + index + 1)))
    );
    views.push(...new SettingView().getViews());
    console.log(views)
    return { views };
  }

  /**
   * Generate a view.
   *
   * The method creates cards for each domain (e.g., sensors, switches, etc.) in the current area, using a combination
   * of Header cards and entity-specific cards.
   * It also handles miscellaneous entities that don't fit into any supported domain.
   *
   * @param {ViewInfo} info The view's strategy information object.
   *
   * @remarks
   * Called upon opening a subview.
   */
  static async generateView(info: ViewInfo): Promise<LovelaceViewConfig> {
    console.log(info)
    const options = info.view.strategy?.options
    if (options?.type === 'setting') {
      const cards = await new SettingView().getCards();
      return {cards}
    }
    if (options?.type) {
      const moduleName = sanitizeClassName(`${options.type}View`);
      const View = (await import(`./pages/${moduleName}`)).default;
      const currentView = new View(options);
      const viewCards = await currentView.getCards();
      return {cards: viewCards}
    }
    if (options?.area) {
      const area = options.area
      const areaView = new AreaView(area);
      const areaCards = await areaView.getCards();
      return {cards: areaCards}
    }
    return { cards: [] };
  }

  /**
   * Handle persistent notifications.
   *
   * @remarks
   * Goes through `NOTIFICATIONS` and shows each one whose version range matches the current version.
   * If the current version is not applicable, the notification is dismissed.
   *
   * @param hass The Home Assistant instance.
   * @returns A promise that resolves when all notifications have been handled.
   */
  private static async handleNotifications(hass: HomeAssistant): Promise<void> {
    const notificationManager = new PersistentNotification(hass, 'chuguan_strategy');
    const currentVersion = STRATEGY_VERSION.replace(/^v/, '');
    const version = semver.coerce(currentVersion) || '0.0.0';

    try {
      await Promise.all(
        NOTIFICATIONS.map(async (notification) => {
          if (semver.gte(version, notification.fromVersion) && semver.lte(version, notification.toVersion)) {
            return notificationManager.showNotification(notification.storageKey, notification.message, {
              title: notification.title,
              version: currentVersion,
            });
          }

          return notificationManager.dismissNotification(notification.storageKey);
        })
      );
    } catch (e) {
      logMessage(lvlError, 'Error while handling persistent notifications for ChuGuan Strategy', e);
    }
  }
}

customElements.define('ll-strategy-chuguan-strategy', MushroomStrategy);

subscribeEvnets()

const STRATEGY_VERSION = 'v1.0.3';
console.info(
  '%c ChuGuan Strategy %c '.concat(STRATEGY_VERSION, ' '),
  'color: white; background: coral; font-weight: 700;',
  'color: coral; background: white; font-weight: 700;'
);